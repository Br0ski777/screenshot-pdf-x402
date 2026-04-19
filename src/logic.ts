import type { Hono } from "hono";
import puppeteer, { type Browser } from "puppeteer";


// ATXP: requirePayment only fires inside an ATXP context (set by atxpHono middleware).
// For raw x402 requests, the existing @x402/hono middleware handles the gate.
// If neither protocol is active (ATXP_CONNECTION unset), tryRequirePayment is a no-op.
async function tryRequirePayment(price: number): Promise<void> {
  if (!process.env.ATXP_CONNECTION) return;
  try {
    const { requirePayment } = await import("@atxp/server");
    const BigNumber = (await import("bignumber.js")).default;
    await requirePayment({ price: BigNumber(price) });
  } catch (e: any) {
    if (e?.code === -30402) throw e;
  }
}

const LAUNCH_ARGS = ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"];
let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (browserInstance?.connected) return browserInstance;
  const execPath = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.PLAYWRIGHT_CHROMIUM_PATH;
  browserInstance = await puppeteer.launch({
    args: LAUNCH_ARGS,
    headless: true,
    ...(execPath ? { executablePath: execPath } : {}),
  });
  return browserInstance;
}

export function registerRoutes(app: Hono) {
  app.get("/api/screenshot", async (c) => {
    await tryRequirePayment(0.008);
    const url = c.req.query("url");
    if (!url) return c.json({ error: "Missing required parameter: url" }, 400);

    const width = parseInt(c.req.query("width") || "1280", 10);
    const height = parseInt(c.req.query("height") || "720", 10);
    const fullPage = c.req.query("fullPage") === "true";
    const format = (c.req.query("format") || "png") as "png" | "jpeg" | "webp";
    const quality = parseInt(c.req.query("quality") || "80", 10);

    if (!["png", "jpeg", "webp"].includes(format))
      return c.json({ error: "Invalid format. Use: png, jpeg, webp" }, 400);

    const browser = await getBrowser();
    const page = await browser.newPage();
    try {
      await page.setViewport({ width, height });
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30_000 });
      const opts: Record<string, unknown> = { type: format, fullPage };
      if (format !== "png") opts.quality = Math.min(100, Math.max(1, quality));
      const buffer = await page.screenshot(opts);
      const ct = format === "png" ? "image/png" : format === "jpeg" ? "image/jpeg" : "image/webp";
      return new Response(buffer, { headers: { "Content-Type": ct, "Cache-Control": "public, max-age=3600" } });
    } catch (err: unknown) {
      return c.json({ error: err instanceof Error ? err.message : "Screenshot failed" }, 500);
    } finally {
      await page.close();
    }
  });

  app.get("/api/pdf", async (c) => {
    await tryRequirePayment(0.01);
    const url = c.req.query("url");
    if (!url) return c.json({ error: "Missing required parameter: url" }, 400);
    const format = c.req.query("format") || "A4";
    const browser = await getBrowser();
    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 30_000 });
      const pdf = await page.pdf({
        format: format as any,
        printBackground: true,
        margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
      });
      return new Response(pdf, {
        headers: { "Content-Type": "application/pdf", "Content-Disposition": "inline; filename=page.pdf" },
      });
    } catch (err: unknown) {
      return c.json({ error: err instanceof Error ? err.message : "PDF generation failed" }, 500);
    } finally {
      await page.close();
    }
  });
}

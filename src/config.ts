import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "screenshot-pdf",
  slug: "screenshot-pdf",
  description: "Capture website screenshots and generate PDFs programmatically via Puppeteer.",
  version: "1.0.0",
  routes: [
    {
      method: "GET",
      path: "/api/screenshot",
      price: "$0.008",
      description: "Capture a screenshot of any URL",
      toolName: "capture_screenshot",
      toolDescription: "Use this when you need a visual capture of a web page. Renders in a real browser (Chromium) and returns an image. Options: custom viewport width/height, full page scroll capture, format (PNG, JPEG, WebP), quality. Returns binary image. Ideal for visual QA testing, generating thumbnails, archiving pages, verifying page rendering. Do NOT use for text extraction — use web_scrape_to_markdown. Do NOT use for PDF from data — use document_generate_pdf.",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "URL to screenshot (e.g. https://example.com)" },
          width: { type: "number", description: "Viewport width in px (default: 1280)" },
          height: { type: "number", description: "Viewport height in px (default: 720)" },
          fullPage: { type: "boolean", description: "Capture full scrollable page (default: false)" },
          format: { type: "string", enum: ["png", "jpeg", "webp"], description: "Image format (default: png)" },
        },
        required: ["url"],
      },
    },
    {
      method: "GET",
      path: "/api/pdf",
      price: "$0.01",
      description: "Generate a PDF from any URL",
      toolName: "webpage_to_pdf",
      toolDescription: "Use this when you need to convert a web page to a PDF document. Renders in real browser, generates printable PDF. Options: paper format (A4, Letter, Legal, Tabloid). Returns binary PDF. Ideal for archiving pages, generating reports, creating printable articles. Do NOT use for custom documents — use document_generate_pdf. Do NOT use for screenshots — use capture_screenshot.",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "URL to convert to PDF (e.g. https://example.com)" },
          format: { type: "string", enum: ["A4", "Letter", "Legal", "Tabloid"], description: "Paper format (default: A4)" },
        },
        required: ["url"],
      },
    },
  ],
};

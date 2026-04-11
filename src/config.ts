import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "screenshot-pdf",
  slug: "screenshot-pdf",
  description: "Capture website screenshots and generate PDFs programmatically. Full page, custom viewport, multiple formats (PNG/JPEG/WebP). Powered by Puppeteer.",
  version: "1.0.0",
  routes: [
    {
      method: "GET",
      path: "/api/screenshot",
      price: "$0.008",
      description: "Capture a screenshot of any URL",
      toolName: "capture_screenshot",
      toolDescription: "Take a screenshot of any web page. Supports custom viewport dimensions (width/height), full page capture, and multiple output formats (PNG, JPEG, WebP with quality control). Use when you need to capture a visual snapshot of a website, generate preview thumbnails, archive a page visually, do visual QA testing, or verify how a page renders. Returns the image binary directly.",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "The URL to screenshot (e.g. https://example.com)" },
          width: { type: "number", description: "Viewport width in pixels (default: 1280)" },
          height: { type: "number", description: "Viewport height in pixels (default: 720)" },
          fullPage: { type: "boolean", description: "Capture the full scrollable page (default: false)" },
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
      toolName: "generate_pdf",
      toolDescription: "Convert any web page to a PDF document. Supports A4, Letter, Legal, Tabloid paper formats with background printing and margins. Use when you need to save a page as PDF, generate a printable version of a web page, create document archives, or produce reports from web content. Returns the PDF binary directly.",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "The URL to convert to PDF (e.g. https://example.com)" },
          format: { type: "string", enum: ["A4", "Letter", "Legal", "Tabloid"], description: "Paper format (default: A4)" },
        },
        required: ["url"],
      },
    },
  ],
};

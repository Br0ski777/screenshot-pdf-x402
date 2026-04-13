import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "screenshot-pdf",
  slug: "screenshot-pdf",
  description: "Capture full-page screenshots and PDFs from any URL. Chromium rendering, custom viewport, PNG/JPEG/WebP output.",
  version: "1.0.0",
  routes: [
    {
      method: "GET",
      path: "/api/screenshot",
      price: "$0.008",
      description: "Capture a screenshot of any URL",
      toolName: "capture_screenshot",
      toolDescription: `Use this when you need a visual capture of a web page. Renders in a real Chromium browser and returns an image.

Returns: 1. Binary image (PNG, JPEG, or WebP) 2. Custom viewport support (width/height in px) 3. Full-page scroll capture option 4. Configurable format and quality.

Example output: binary image file with Content-Type image/png, typical size 200-800KB for a full page.

Use this BEFORE visual QA testing, generating page thumbnails, archiving web pages, or verifying responsive design. Essential for automated screenshot pipelines and visual regression testing.

Do NOT use for text extraction -- use web_scrape_to_markdown instead. Do NOT use for PDF from data -- use document_generate_pdf instead. Do NOT use for PDF from URL -- use webpage_to_pdf instead.`,
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
      outputSchema: {
        type: "string",
        description: "Binary image data (PNG, JPEG, or WebP) returned with appropriate Content-Type header. Typical size 200-800KB.",
      },
    },
    {
      method: "GET",
      path: "/api/pdf",
      price: "$0.01",
      description: "Generate a PDF from any URL",
      toolName: "webpage_to_pdf",
      toolDescription: `Use this when you need to convert a live web page to a printable PDF document. Renders in a real Chromium browser and returns binary PDF.

Returns: 1. Binary PDF file 2. Configurable paper format (A4, Letter, Legal, Tabloid) 3. Print-optimized layout with proper page breaks.

Example output: binary PDF file with Content-Type application/pdf, properly paginated with headers/footers.

Use this FOR archiving web pages as PDF, generating printable articles, saving receipts or invoices from URLs, or creating offline documentation snapshots.

Do NOT use for custom documents from HTML/Markdown -- use document_generate_pdf instead. Do NOT use for screenshots -- use capture_screenshot instead. Do NOT use for web scraping text -- use web_scrape_to_markdown instead.`,
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "URL to convert to PDF (e.g. https://example.com)" },
          format: { type: "string", enum: ["A4", "Letter", "Legal", "Tabloid"], description: "Paper format (default: A4)" },
        },
        required: ["url"],
      },
      outputSchema: {
        type: "string",
        description: "Binary PDF document returned with Content-Type application/pdf. Properly paginated with print-optimized layout.",
      },
    },
  ],
};

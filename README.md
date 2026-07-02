# Screenshot & PDF Capture API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://screenshot-pdf.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Capture full-page screenshots and PDFs from any URL. Chromium rendering, custom viewport, PNG/JPEG/WebP output. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

Part of the [klymax402](https://klymax402.com) marketplace -- 100 x402 micropayment APIs for AI agents, one wallet, USDC on Base.

## Quickstart -- MCP

Add to your MCP client config (Claude Desktop, Cursor, ElizaOS, etc.):

```json
{
  "mcpServers": {
    "screenshot-pdf": {
      "url": "https://screenshot-pdf.api.klymax402.com/mcp"
    }
  }
}
```

## Quickstart -- HTTP (x402)

```bash
curl "https://screenshot-pdf.api.klymax402.com/api/screenshot?url=https://example.com"
# -> 402 Payment Required, with an x402 payment challenge in the response body
```

Any x402-aware client ([`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch), [`x402-agent-tools`](https://www.npmjs.com/package/x402-agent-tools), ATXP) handles the 402 -> sign -> retry cycle automatically.

## Tools

| Tool | Method | Path | Price | Description |
|---|---|---|---|---|
| `capture_screenshot` | GET | `/api/screenshot` | $0.008 | Capture a screenshot of any URL |
| `webpage_to_pdf` | GET | `/api/pdf` | $0.01 | Generate a PDF from any URL |

### `capture_screenshot`

Use this when you need a visual capture of a web page. Renders in a real Chromium browser and returns an image.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `url` | string | yes | URL to screenshot (e.g. https://example.com) |
| `width` | number | no | Viewport width in px (default: 1280) |
| `height` | number | no | Viewport height in px (default: 720) |
| `fullPage` | boolean | no | Capture full scrollable page (default: false) |
| `format` | string | no | Image format (default: png) |

Example response:

```json
binary image file with Content-Type image/png, typical size 200-800KB for a full page.
```

**When to use**: visual QA testing, generating page thumbnails, archiving web pages, or verifying responsive design. Essential for automated screenshot pipelines and visual regression testing.

**Not for**: text extraction (use `web_scrape_to_markdown`), PDF from data (use `document_generate_pdf`), PDF from URL (use `webpage_to_pdf`).

### `webpage_to_pdf`

Use this when you need to convert a live web page to a printable PDF document. Renders in a real Chromium browser and returns binary PDF.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `url` | string | yes | URL to convert to PDF (e.g. https://example.com) |
| `format` | string | no | Paper format (default: A4) |

Example response:

```json
binary PDF file with Content-Type application/pdf, properly paginated with headers/footers.
```

**When to use**: archiving web pages as PDF, generating printable articles, saving receipts or invoices from URLs, or creating offline documentation snapshots.

**Not for**: custom documents from HTML/Markdown (use `document_generate_pdf`), screenshots (use `capture_screenshot`), web scraping text (use `web_scrape_to_markdown`).

## Example agent prompts

- "A visual capture of a web page"
- "Convert a live web page to a printable PDF document"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)
- Also reachable via [ATXP](https://atxp.ai) (OAuth-wrapped x402, RFC 9728 protected-resource metadata)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT

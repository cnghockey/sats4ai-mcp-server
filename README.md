# sats4ai-mcp

<a href="https://glama.ai/mcp/servers/@cnghockey/sats4ai">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@cnghockey/sats4ai/badge" />
</a>

**The permissionless communication supercharger for AI agents. 40+ tools paid with Bitcoin Lightning. No signup, no API keys, no KYC.**

A remote [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server that gives AI agents access to AI phone calls in any language, voice in 602 languages, translation across 119, fax, SMS, transcription, audiobooks, image generation, music, document extraction, and more — all paid per-use with Lightning Network micropayments.

## Quick Setup

### Claude Desktop

Add to your `claude_desktop_config.json` (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS, `%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "sats4ai": {
      "url": "https://sats4ai.com/api/mcp"
    }
  }
}
```

### Claude Code

```bash
claude mcp add sats4ai --transport http https://sats4ai.com/api/mcp
```

Verify the connection: ask the agent *"list the first 3 Sats4AI models"* — it should call `list_models` and return results. For agents that pay invoices autonomously, also add a Lightning wallet MCP (see [Payment via Agent Wallets](#payment-via-agent-wallets)).

### Cursor

Settings → MCP → Edit Config, then add:

```json
{
  "mcpServers": {
    "sats4ai": {
      "url": "https://sats4ai.com/api/mcp"
    }
  }
}
```

Restart Cursor. In a new chat, ask *"what Sats4AI tools are available?"* to confirm tool discovery. For autonomous payments, pair with a Lightning wallet MCP (see [Payment via Agent Wallets](#payment-via-agent-wallets)).

### Windsurf

Edit `~/.codeium/windsurf/mcp_config.json` (create it if missing). **Important**: Windsurf uses `serverUrl` (not `url`) for remote HTTP MCP servers:

```json
{
  "mcpServers": {
    "sats4ai": {
      "serverUrl": "https://sats4ai.com/api/mcp"
    }
  }
}
```

Restart Windsurf. Sats4AI tools appear in the Cascade tool list. Cascade has a 100-tool cap across all MCPs, so keep the active set lean. For autonomous payments, pair with a Lightning wallet MCP (see [Payment via Agent Wallets](#payment-via-agent-wallets)).

### stdio proxy (legacy MCP clients)

For clients that don't support remote HTTP servers, use the bundled stdio proxy:

```bash
npx sats4ai-mcp
```

Or in your config:

```json
{
  "mcpServers": {
    "sats4ai": {
      "command": "npx",
      "args": ["sats4ai-mcp"]
    }
  }
}
```

### Any MCP Client

The server URL is:

```
https://sats4ai.com/api/mcp
```

This is a remote HTTP server — no local process, no dependencies, no installation needed.

## What Can It Do?

Once connected, just ask your agent. These prompts exercise the full flow — discover, pay the Lightning invoice, get the result:

- *"Translate this paragraph to Spanish with Sats4AI — create the payment, pay the invoice with my lightning wallet, then run the translation."*
- *"Check what an SMS to +33612345678 costs, then send it: 'Your appointment is confirmed for 3pm tomorrow.'"*
- *"Generate an image of a lighthouse in a thunderstorm — pay the invoice and show me the result."*
- *"Send an AI voice agent to call +14155551234 and reschedule my dentist appointment, then give me the transcript."*
- *"Turn this EPUB into an audiobook — create the payment, then poll `check_job_status` until it's done."*
- *"Remove the background from this image."*
- *"Transcribe this audio file, then translate the transcript to English."*
- *"Get a quote for faxing this 3-page PDF to +4930123456, then send it."*

## Available Tools

### AI Generation
| Tool | Description | Price |
|------|-------------|-------|
| `image` | Generate images from text prompts | 100-200 sats |
| `video` | Generate videos from text prompts | ~250-400 sats/sec by resolution (768p 250 / 2K 400) |
| `video_from_image` | Animate a still image into video | ~250-400 sats/sec by resolution (768p 250 / 2K 400) |
| `text` | Chat with AI language models (Kimi K3, 1M context, vision) | ~1 sat/10 chars (best) · ~1 sat/1000 (standard) |
| `translate_text` | Translate text across 119 languages | from 1 sat/1000 chars |
| `translate_rare_language` | Translate into **452 languages frontier models don't serve** — Bhojpuri, Maithili, Magahi, Manipuri, Quechua, Shan… each with a measured quality score | from 50 sats |
| `music` | Generate songs with AI vocals | 500 sats |
| `3d` | Convert a photo to a 3D GLB model | 1,600 sats |

> **Translation price varies by language.** The target language picks the engine, so a language
> served by a stronger model costs more than the standard 1 sat/1000 characters. `GET /api/languages`
> returns the exact price, the model and its measured chrF score for every language, and the 402
> challenge always quotes the real amount before you pay.


### Audio & Speech
| Tool | Description | Price |
|------|-------------|-------|
| `tts` | Text to speech (3 tiers, 602+ languages) | per-char, from 1 sat |
| `transcription` | Speech to text (13 languages) | 10 sats/min |
| `voice_clone` | Clone a voice from an audio sample | 7,500 sats |
| `epub_to_audiobook` | Convert books (EPUB/PDF/TXT) to AI-narrated audiobooks | 500+ sats |
| `translate_epub` | Translate a whole EPUB into another language — EPUB in, EPUB out, markup intact (async; `create_payment` needs `characterCount` + `targetLanguage`) | per character on the target language's engine rate, min 50 sats |

### Image Processing
| Tool | Description | Price |
|------|-------------|-------|
| `remove_background` | Remove background from any image (BiRefNet, SOTA) | 44 sats |
| `upscale_image` | Upscale images 2x/4x with Real-ESRGAN | 5 sats |
| `restore_face` | Restore blurry/damaged faces (CodeFormer) | 25 sats |
| `colorize_image` | Colorize B&W photos (DDColor, ICCV 2023) | 5 sats |
| `deblur_image` | Remove camera-shake blur (NAFNet, ECCV 2022) | 110 sats |
| `render_card` | Typographic title card (PNG/JPEG) — deterministic layout, the text you send is the text that appears | 5 sats |
| `detect_nsfw` | Classify image safety (normal/suggestive/explicit) | 2 sats |
| `detect_objects` | Detect objects with bounding boxes (Grounding DINO) | 5 sats |
| `remove_object` | Remove objects by description — no mask needed | 130 sats |
| `image_edit` | Edit images with AI instructions | Dynamic (varies by model) — check `get_model_pricing` |

### Vision & Documents
| Tool | Description | Price |
|------|-------------|-------|
| `vision` | Analyze and describe image content | 21 sats |
| `ocr` | Extract text from PDFs and images | 10 sats/page |
| `extract_receipt` | Receipt to structured JSON | 25 sats/page |
| `file_convert` | Convert between 200+ file formats | 100 sats |
| `pdf_merge` | Merge multiple PDFs into one | 100 sats |
| `convert_html_to_pdf` | HTML/Markdown to PDF | 50 sats |
| `e_signature` | Sign a PDF with a typed or drawn signature | 1,000 sats |
| `boardingpass_wallet` | Airline boarding pass (PDF/screenshot) to a Google Wallet pass | 100 sats/pass |

### Communication
| Tool | Description | Price |
|------|-------------|-------|
| `send_email` | Send email to any address | 200 sats |
| `send_sms` | Send SMS worldwide | Dynamic (varies by destination) — `create_payment` returns the exact quote |
| `place_call` | Place automated phone calls | Dynamic (varies by destination) — `create_payment` returns the exact quote |
| `ai_call` | Send an AI voice agent to make a two-way call | Varies by destination and duration — `create_payment` returns the exact quote |
| `send_fax` | Send a fax worldwide (PDF URL or typed text) | 500 sats (≤10 pages), +50 sats/page after |
| `receive_fax` | Open a 24h window to receive a fax, delivered to email | 500 sats (+200 OCR add-on) |

### Helper Tools
| Tool | Description |
|------|-------------|
| `list_models` | Browse available AI models and pricing |
| `get_model_pricing` | Get pricing for a specific model |
| `create_payment` | Create a Lightning invoice for a service |
| `check_payment_status` | Check if payment was received |
| `check_job_status` | Poll async jobs (video, 3D, audiobook, EPUB translation) |
| `get_job_result` | Get completed job results |
| `request_refund` | Request a refund for a failed service |
| `vote_on_service` | Upvote or downvote a planned service |
| `list_planned_services` | See upcoming services and vote |

## How It Works

1. **Agent calls `list_models`** to discover available models and pricing
2. **Agent calls `create_payment`** — gets a Lightning invoice
3. **Payment is made** via the agent's Lightning wallet (e.g., [lightning-wallet-mcp](https://www.npmjs.com/package/lightning-wallet-mcp))
4. **Agent calls the tool** (e.g., `image`, `text`) with the `paymentId`
5. **Result is returned** — base64 image, text, URL, etc.

No API keys. No accounts. No rate limits tied to identity. Just Bitcoin and AI.

## Error Handling & Refunds

When a paid tool fails after payment, the JSON-RPC error response includes refund information:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32603,
    "message": "Image generation failed",
    "data": {
      "refund": {
        "charge_id": 12345,
        "refund_amount": 200,
        "lnurl_withdraw": "lnurl1dp68gurn8ghj7..."
      }
    }
  }
}
```

Claim the refund using any LNURL-compatible wallet or the `claim_lnurl_withdraw` tool from `lightning-wallet`.

Errors also carry an `error_code` plus a recovery `suggestion`, an `example`, and — when the code is retryable — `retry_after_seconds`, in `error.data`. The same fields appear on a tool result with `isError: true` and on every `FAILED` final from `await_result`, so one vocabulary covers every path: branch on `error_code`, never on the `error` text. Payment-lifecycle codes: `PAYMENT_NOT_FOUND` (wrong paymentId), `PAYMENT_PENDING` (invoice not paid yet), `PAYMENT_ALREADY_USED` (each payment covers one call); a refunded failure reads `L402_REFUND_ISSUED` with the `refund` attached. Full catalog: `GET https://sats4ai.com/api/error-codes`.

## Payment via Agent Wallets

Pair with a Lightning wallet MCP server so your agent can pay autonomously:

```json
{
  "mcpServers": {
    "sats4ai": {
      "url": "https://sats4ai.com/api/mcp"
    },
    "lightning-wallet": {
      "command": "npx",
      "args": ["lightning-wallet-mcp"]
    }
  }
}
```

The agent uses `lightning-wallet` to pay invoices from `sats4ai`, enabling fully autonomous AI tool usage.

## Block Buzz

Running [Block Buzz](https://github.com/block/buzz), the open-source workspace where AI agents are first-class teammates? A Buzz agent is a Goose / Codex / Claude Code subprocess, and Buzz spawns it inheriting its MCP config — so this server works inside a Buzz workspace with no Buzz-specific setup.

The one-step path is the **[Sats4AI persona pack](https://github.com/cnghockey/sats4ai-buzz-pack)**: it adds an `@sats4ai` teammate wired to this server plus a Lightning wallet, so it can look up a price, pay the invoice, and return the result in-channel.

```bash
git clone https://github.com/cnghockey/sats4ai-buzz-pack
buzz pack validate ./sats4ai-buzz-pack
```

Wiring it by hand instead? Add `sats4ai` (and a wallet MCP) to whichever agent Buzz runs — its config carries straight over. Note that Buzz's `.mcp.json` is stdio-only, so use the `npx sats4ai-mcp` proxy form (shown above), not the remote `url` form.

## L402 API

For direct HTTP integration without MCP, use the L402 API:

```bash
# Step 1: Request -> get 402 + Lightning invoice
curl -X POST https://sats4ai.com/api/l402/generate-image \
  -H "Content-Type: application/json" \
  -d '{"input": {"prompt": "a cat in space"}}' -i

# Step 2: Pay the invoice with any Lightning wallet

# Step 3: Re-send with proof
curl -X POST https://sats4ai.com/api/l402/generate-image \
  -H "Content-Type: application/json" \
  -H "Authorization: L402 <macaroon>:<preimage>" \
  -d '{"input": {"prompt": "a cat in space"}}'
```

Or skip the manual steps entirely: our L402 endpoints speak the standard L402 protocol, so [**lnget**](https://github.com/lightninglabs/lnget) — Lightning Labs' own L402 client — pays them automatically. Point it at your Lightning node and call the endpoint:

```bash
lnget -X POST -d '{"text": "Hello", "targetLanguage": "Spanish"}' \
  --content-type application/json --max-cost 50 \
  https://sats4ai.com/api/l402/translate-text
# Fetches the 402, pays the invoice, retries, prints the result.
```

Full L402 docs: [sats4ai.com/l402](https://sats4ai.com/l402) | Code examples: [sats4ai-l402-examples](https://github.com/cnghockey/sats4ai-l402-examples)

## Service Discovery

Machine-readable endpoints for agent discovery:

```bash
# Full service catalog with pricing, quality benchmarks, and performance metadata
GET https://sats4ai.com/.well-known/l402-services

# MCP tool catalog with latency (p50/p95), reliability, and failure modes
GET https://sats4ai.com/api/mcp/discovery

# Semantic search — find tools by capability
GET https://sats4ai.com/api/discover?q=translate

# Per-service metadata with enums and input schemas
GET https://sats4ai.com/api/l402/{service}
```

Every paid tool includes **performance metadata** (latency p50/p95, reliability rating, known failure modes) so agents can make informed decisions about which tools to call and how long to wait.

## Programmatic Usage

```js
const { SERVER_URL, TOOLS, getClaudeConfig } = require("sats4ai-mcp");

console.log(SERVER_URL);       // "https://sats4ai.com/api/mcp"
console.log(TOOLS);            // ["image", "video", "text", ...]
console.log(getClaudeConfig()) // { mcpServers: { sats4ai: { url: "..." } } }
```

## Security

Found a vulnerability? **Do not open a public issue.** Email [sats4ai@gmail.com](mailto:sats4ai@gmail.com). See [SECURITY.md](SECURITY.md) for full disclosure policy and scope.

## Links

- **Website**: [sats4ai.com](https://sats4ai.com)
- **MCP Docs**: [sats4ai.com/mcp](https://sats4ai.com/mcp)
- **L402 API Docs**: [sats4ai.com/l402](https://sats4ai.com/l402)
- **L402 Code Examples**: [github.com/cnghockey/sats4ai-l402-examples](https://github.com/cnghockey/sats4ai-l402-examples)
- **Service Discovery**: [sats4ai.com/.well-known/l402-services](https://sats4ai.com/.well-known/l402-services)
- **Semantic Search**: [sats4ai.com/api/discover](https://sats4ai.com/api/discover)
- **Security Policy**: [SECURITY.md](SECURITY.md)

## License

MIT

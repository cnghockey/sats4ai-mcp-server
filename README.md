# sats4ai-mcp

<a href="https://glama.ai/mcp/servers/cnghockey/sats4ai">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/cnghockey/sats4ai/badge" />
</a>

**25+ AI tools paid with Bitcoin Lightning. No signup, no API keys, no KYC.**

A remote [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server that gives AI agents access to image generation, video creation, text generation, speech, OCR, audiobook conversion, email, SMS, voice cloning, and more — all paid per-use with Lightning Network micropayments.

## Quick Setup

### Claude Desktop

Add to your `claude_desktop_config.json`:

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

### Cursor

Add to your MCP settings:

```json
{
  "mcpServers": {
    "sats4ai": {
      "url": "https://sats4ai.com/api/mcp"
    }
  }
}
```

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

## Available Tools

### AI Generation
| Tool | Description | Price |
|------|-------------|-------|
| `image` | Generate images from text prompts | 100-200 sats |
| `video` | Generate videos from text prompts | 50 sats/unit |
| `video_from_image` | Animate a still image into video | 100 sats/sec |
| `text` | Chat with AI language models (262K context) | ~1 sat/100 chars |
| `music` | Generate songs with AI vocals | 100 sats |
| `3d` | Convert a photo to a 3D GLB model | 350 sats |

### Audio & Speech
| Tool | Description | Price |
|------|-------------|-------|
| `tts` | Text to speech with multiple voices | 300 sats |
| `transcription` | Speech to text (13 languages) | 10 sats/min |
| `voice_clone` | Clone a voice from an audio sample | 7,500 sats |

### Vision & Documents
| Tool | Description | Price |
|------|-------------|-------|
| `vision` | Analyze and describe image content | 21 sats |
| `ocr` | Extract text from PDFs and images | 10 sats/page |
| `epub_to_audiobook` | Convert books (EPUB/PDF/TXT) to AI-narrated audiobooks | 500+ sats |
| `file_convert` | Convert between 200+ file formats | 100 sats |
| `image_edit` | Edit images with AI instructions | Dynamic |
| `pdf_merge` | Merge multiple PDFs into one | 100 sats |

### Communication
| Tool | Description | Price |
|------|-------------|-------|
| `email` | Send email to any address | 200 sats |
| `sms` | Send SMS worldwide | Dynamic |
| `call` | Place automated phone calls | Dynamic |

### Helper Tools
| Tool | Description |
|------|-------------|
| `list_models` | Browse available AI models and pricing |
| `get_model_pricing` | Get pricing for a specific model |
| `create_payment` | Create a Lightning invoice for a service |
| `check_payment_status` | Check if payment was received |
| `check_job_status` | Poll async jobs (video, 3D) |
| `get_job_result` | Get completed job results |

## How It Works

1. **Agent calls `list_models`** to discover available models and pricing
2. **Agent calls `create_payment`** — gets a Lightning invoice
3. **Payment is made** via the agent's Lightning wallet (e.g., [lightning-wallet-mcp](https://www.npmjs.com/package/lightning-wallet-mcp))
4. **Agent calls the tool** (e.g., `image`, `text`) with the `paymentId`
5. **Result is returned** — base64 image, text, URL, etc.

No API keys. No accounts. No rate limits tied to identity. Just Bitcoin and AI.

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

## L402 API

For direct HTTP integration without MCP, use the L402 API:

```bash
# Step 1: Request -> get 402 + Lightning invoice
curl -X POST https://sats4ai.com/api/l402/image \
  -H "Content-Type: application/json" \
  -d '{"prompt": "a cat in space"}' -i

# Step 2: Pay the invoice with any Lightning wallet

# Step 3: Re-send with proof
curl -X POST https://sats4ai.com/api/l402/image \
  -H "Content-Type: application/json" \
  -H "Authorization: L402 <macaroon>:<preimage>" \
  -d '{"prompt": "a cat in space"}'
```

Full L402 docs: [sats4ai.com/l402](https://sats4ai.com/l402) | Code examples: [sats4ai-l402-examples](https://github.com/cnghockey/sats4ai-l402-examples)

## Service Discovery

Machine-readable service manifest:

```
GET https://sats4ai.com/.well-known/l402-services
```

## Programmatic Usage

```js
const { SERVER_URL, TOOLS, getClaudeConfig } = require("sats4ai-mcp");

console.log(SERVER_URL);       // "https://sats4ai.com/api/mcp"
console.log(TOOLS);            // ["image", "video", "text", ...]
console.log(getClaudeConfig()) // { mcpServers: { sats4ai: { url: "..." } } }
```

## Links

- **Website**: [sats4ai.com](https://sats4ai.com)
- **MCP Docs**: [sats4ai.com/mcp](https://sats4ai.com/mcp)
- **L402 API Docs**: [sats4ai.com/l402](https://sats4ai.com/l402)
- **L402 Code Examples**: [github.com/cnghockey/sats4ai-l402-examples](https://github.com/cnghockey/sats4ai-l402-examples)
- **Service Discovery**: [sats4ai.com/.well-known/l402-services](https://sats4ai.com/.well-known/l402-services)

## License

MIT

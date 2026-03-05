# Sats4AI MCP Server

Bitcoin-powered AI tools marketplace accessible via the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/). Pay with Lightning Network micropayments — no signup or API keys required.

## MCP Endpoint

```
https://sats4ai.com/api/mcp
```

### Connect with Claude Desktop

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

## Available Tools

| Tool | Description | Price (sats) |
|------|-------------|-------------|
| `generate_image` | Generate AI images from text prompts | ~100 |
| `generate_text` | Chat with multiple LLM providers (Groq, DeepInfra, DeepSeek) | ~21 |
| `generate_video` | Generate video from text prompts using Kling V3 | ~2500 |
| `generate_video_from_image` | Generate video from an image with text guidance | ~2500 |
| `generate_music` | Create original songs with AI-composed music and vocals | ~500 |
| `synthesize_speech` | Convert text to speech with customizable voices | ~50 |
| `generate_3d_model` | Generate 3D models from images or text | ~200 |
| `analyze_image` | Analyze and describe image content using vision models | ~50 |
| `convert_file` | Convert files between formats using CloudConvert | ~100 |
| `send_sms` | Send SMS messages worldwide | ~1500 |

## How Payment Works

1. Call any tool via MCP
2. Receive a Lightning Network invoice
3. Pay the invoice (most MCP clients handle this automatically)
4. Get your result

All payments use the [L402](https://docs.lightning.engineering/the-lightning-network/l402) protocol — HTTP 402 + Lightning invoices + macaroon tokens.

## Links

- **Website**: [https://sats4ai.com](https://sats4ai.com)
- **MCP Documentation**: [https://sats4ai.com/mcp](https://sats4ai.com/mcp)
- **MCP Registry**: [com.sats4ai/bitcoin-ai-tools](https://registry.modelcontextprotocol.io/v0.1/servers?search=sats4ai)
- **L402 Service Discovery**: [https://sats4ai.com/.well-known/l402-services](https://sats4ai.com/.well-known/l402-services)

## License

MIT

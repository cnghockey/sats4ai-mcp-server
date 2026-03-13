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
| `create_payment` | Create a Lightning invoice for a service | free |
| `check_payment_status` | Verify a payment has been received | free |
| `list_models` | List available AI models with pricing | free |
| `get_model_pricing` | Get pricing for a specific model | free |
| `generate_image` | Generate AI images from text prompts | ~100 |
| `generate_text` | Chat with AI or generate content | ~21 |
| `generate_video` | Generate video from text prompts | ~2500 |
| `generate_video_from_image` | Animate an image into a video | ~2500 |
| `generate_music` | Create original AI-composed music | ~500 |
| `synthesize_speech` | Convert text to speech | ~50 |
| `transcribe_audio` | Transcribe audio to text | ~10/min |
| `generate_3d_model` | Generate 3D models from images | ~200 |
| `analyze_image` | Analyze image content with vision AI | ~50 |
| `extract_text_ocr` | Extract text from PDFs and images | ~10/page |
| `convert_file` | Convert files between 200+ formats | ~100 |
| `check_job_status` | Check status of an async job | free |
| `get_job_result` | Get the result of a completed job | free |
| `send_sms` | Send SMS messages worldwide | ~1500 |
| `place_call` | Make automated phone calls worldwide | ~1500 |

## How Payment Works

1. Call `create_payment` with the tool name and model ID
2. Receive a Lightning Network invoice
3. Pay the invoice with any Lightning wallet
4. Call the tool with the `paymentId` to get your result

All payments use the [L402](https://docs.lightning.engineering/the-lightning-network/l402) protocol — HTTP 402 + Lightning invoices.

## Links

- **Website**: [https://sats4ai.com](https://sats4ai.com)
- **MCP Documentation**: [https://sats4ai.com/mcp](https://sats4ai.com/mcp)

## License

MIT

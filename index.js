/**
 * sats4ai-mcp — 25+ AI tools paid with Bitcoin Lightning
 *
 * This is a remote MCP server. No local process needed.
 * Add the URL to your MCP client config and start using tools immediately.
 *
 * Server URL: https://sats4ai.com/api/mcp
 * Docs: https://sats4ai.com/mcp
 * L402 API: https://sats4ai.com/l402
 */

const SERVER_URL = "https://sats4ai.com/api/mcp";

const TOOLS = [
  "image",
  "video",
  "video_from_image",
  "text",
  "vision",
  "music",
  "tts",
  "transcription",
  "3d",
  "ocr",
  "file_convert",
  "email",
  "sms",
  "call",
  "voice_clone",
  "image_edit",
  "pdf_merge",
  "epub_to_audiobook",
  "convert_html_to_pdf",
  "translate_text",
  "extract_receipt",
  "ai_call",
];

const HELPER_TOOLS = [
  "create_payment",
  "check_payment_status",
  "check_job_status",
  "get_job_result",
  "list_models",
  "get_model_pricing",
  "request_refund",
  "vote_on_service",
  "list_planned_services",
];

/**
 * MCP client configuration for Sats4AI.
 * Copy this into your MCP client settings.
 */
function getConfig() {
  return {
    "sats4ai": {
      "url": SERVER_URL,
    },
  };
}

/**
 * Claude Desktop / Claude Code configuration.
 * Add this to your claude_desktop_config.json or .mcp.json
 */
function getClaudeConfig() {
  return {
    "mcpServers": {
      "sats4ai": {
        "url": SERVER_URL,
      },
    },
  };
}

module.exports = {
  SERVER_URL,
  TOOLS,
  HELPER_TOOLS,
  getConfig,
  getClaudeConfig,
};

/** Remote MCP server URL */
export declare const SERVER_URL: string;

/** Available AI tool names */
export declare const TOOLS: string[];

/** Helper tool names (payment, job status, model listing) */
export declare const HELPER_TOOLS: string[];

/** Generic MCP client config object */
export declare function getConfig(): Record<string, { url: string }>;

/** Claude Desktop / Claude Code config object */
export declare function getClaudeConfig(): {
  mcpServers: Record<string, { url: string }>;
};

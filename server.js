#!/usr/bin/env node
// MCP stdio proxy — forwards to https://sats4ai.com/api/mcp
const { createInterface } = require('readline');
const rl = createInterface({ input: process.stdin });

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  let request;
  try { request = JSON.parse(trimmed); } catch { return; }
  if (request.method?.startsWith('notifications/')) return;
  try {
    const res = await fetch('https://sats4ai.com/api/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    const response = await res.json();
    if (response !== null) process.stdout.write(JSON.stringify(response) + '\n');
  } catch (e) {
    process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: request.id, error: { code: -32603, message: e.message } }) + '\n');
  }
});

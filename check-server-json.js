#!/usr/bin/env node
// Publish gate: server.json (the MCP registry card) must stay in sync with
// package.json, and the remotes entry must use the schema-valid "type" key.
// A malformed card silently drops the hosted endpoint from the registry
// (that happened through v1.5.4 via a "transportType" key).
const fs = require("fs");
const path = require("path");

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf8"));
const card = JSON.parse(fs.readFileSync(path.join(__dirname, "server.json"), "utf8"));

const errors = [];

if (card.version !== pkg.version)
  errors.push(`server.json version "${card.version}" != package.json version "${pkg.version}"`);
if (card.name !== pkg.mcpName)
  errors.push(`server.json name "${card.name}" != package.json mcpName "${pkg.mcpName}"`);

const npmPkg = (card.packages || []).find((p) => p.registryType === "npm");
if (!npmPkg) {
  errors.push("server.json has no npm packages entry");
} else {
  if (npmPkg.identifier !== pkg.name)
    errors.push(`server.json packages identifier "${npmPkg.identifier}" != package.json name "${pkg.name}"`);
  if (npmPkg.version !== pkg.version)
    errors.push(`server.json packages version "${npmPkg.version}" != package.json version "${pkg.version}"`);
}

const remote = (card.remotes || [])[0];
if (!remote) {
  errors.push("server.json has no remotes entry — the hosted endpoint must be advertised");
} else {
  if (remote.transportType)
    errors.push('remotes[0] uses "transportType" — the 2025-12-11 schema requires "type"');
  if (remote.type !== "streamable-http")
    errors.push(`remotes[0].type is "${remote.type}", expected "streamable-http"`);
  if (remote.url !== "https://sats4ai.com/api/mcp")
    errors.push(`remotes[0].url is "${remote.url}", expected "https://sats4ai.com/api/mcp"`);
}

if (errors.length) {
  console.error("server.json drift check FAILED:\n  - " + errors.join("\n  - "));
  process.exit(1);
}
console.log("server.json in sync with package.json (v" + pkg.version + ")");

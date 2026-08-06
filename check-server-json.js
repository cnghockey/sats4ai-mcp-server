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
// Registry API rejects descriptions over 100 chars (422) even though the JSON
// schema allows more — caught live 2026-07-10.
if ((card.description || "").length > 100)
  errors.push(`server.json description is ${card.description.length} chars — registry caps it at 100`);
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

// ─── README price drift ──────────────────────────────────────────────────────
// This gate checked version sync and nothing else, so the README's price table
// rotted unnoticed: at v1.5.6 EIGHT of its prices disagreed with what the API
// actually charges — 3d said 350 against a real 1600, remove_object 320 against
// 130, deblur 20 against 110, extract_receipt 50 against 25 — and `video` /
// `video_from_image` published the ModelPayment FLOOR (50, 100) as if it were
// the per-second rate. This package is how agents learn what things cost, and
// it lives in a different repo from the pricing, so nothing upstream could see
// it. Now it diffs against the live manifest at publish time.
//
// FAIL-SOFT on network trouble, FAIL-HARD on a real mismatch: an unreachable
// manifest must not block a publish (offline, CI without egress), but a
// manifest that answers and disagrees is exactly the bug this exists for.
const README_PRICES = {
  // README tool name -> [manifest service id, expected flat sats]
  // Only FLAT services are pinned. Dynamic ones (video, sms, calls, tts, text)
  // have no single number to compare and the README states them as ranges.
  music: ["generate-music", 500],
  "3d": ["generate-3d-model", 1600],
  vision: ["analyze-image", 21],
  voice_clone: ["clone-voice", 7500],
  transcription: ["transcribe-audio", 10],
  ocr: ["extract-document", 10],
  extract_receipt: ["extract-receipt", 25],
  file_convert: ["convert-file", 100],
  pdf_merge: ["merge-pdfs", 100],
  convert_html_to_pdf: ["convert-html-to-pdf", 50],
  send_email: ["send-email", 200],
  e_signature: ["e-signature", 1000],
  boardingpass_wallet: ["boardingpass-wallet", 100],
  remove_background: ["remove-background", 44],
  upscale_image: ["upscale-image", 5],
  restore_face: ["restore-face", 25],
  colorize_image: ["colorize-image", 5],
  deblur_image: ["deblur-image", 110],
  detect_nsfw: ["detect-nsfw", 2],
  detect_objects: ["detect-objects", 5],
  remove_object: ["remove-object", 130],
};

(async () => {
  const readme = fs.readFileSync(path.join(__dirname, "README.md"), "utf8");
  let live;
  try {
    const res = await fetch("https://sats4ai.com/.well-known/l402-services", {
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    live = await res.json();
  } catch (e) {
    console.warn(`price drift check SKIPPED — could not reach the live manifest (${e.message}).`);
    console.warn("Publishing anyway; re-run this check when you have network.");
    return;
  }

  const byId = Object.fromEntries((live.services || []).map((s) => [s.id, s]));
  const priceDrift = [];
  let pinned = 0;

  for (const [tool, [id, expected]] of Object.entries(README_PRICES)) {
    const amount = byId[id] && byId[id].pricing && byId[id].pricing.amount;
    if (typeof amount !== "number") {
      priceDrift.push(`${tool}: "${id}" has no flat amount in the live manifest — remap or unpin it`);
      continue;
    }
    // 1. Does the README table still agree with what the API charges?
    const row = readme.split("\n").find((l) => l.includes("`" + tool + "`"));
    if (!row) {
      priceDrift.push(`${tool}: no README row found — the table changed shape`);
      continue;
    }
    pinned++;
    const nums = [...row.matchAll(/([\d,]+)\s*sats?/gi)].map((m) => Number(m[1].replace(/,/g, "")));
    if (!nums.includes(amount)) {
      priceDrift.push(
        `${tool}: README says ${nums.join("/") || "(no number)"} but the API charges ${amount} sats`,
      );
    }
    // 2. Does the pin in THIS file still match? Catches a reprice that updated
    //    the README by hand and left the guard describing the old world.
    if (amount !== expected) {
      priceDrift.push(
        `${tool}: pinned ${expected} here but the API charges ${amount} — update BOTH the README row and the pin`,
      );
    }
  }

  // A pin list that matches nothing passes vacuously — the exact failure this
  // check exists to prevent — so refuse to be silently empty.
  if (pinned < Object.keys(README_PRICES).length - 2) {
    console.error(`price drift check FAILED: only ${pinned} README rows matched — the table changed shape.`);
    process.exit(1);
  }
  if (priceDrift.length) {
    console.error("README price drift FAILED:\n  - " + priceDrift.join("\n  - "));
    process.exit(1);
  }
  console.log(`README prices agree with the live API (${pinned} services checked)`);
})();

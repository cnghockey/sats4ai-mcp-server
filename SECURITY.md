# Security Policy

## Reporting a Vulnerability

Sats4AI handles Bitcoin Lightning payments. We take security seriously.

**Do NOT open a public GitHub issue for security vulnerabilities.**

### How to report

Email **security@sats4ai.com** with:

1. Description of the vulnerability
2. Steps to reproduce
3. Impact assessment (what an attacker could do)
4. Any relevant transaction IDs, endpoints, or request/response data

### What to expect

- Acknowledgment within 48 hours
- Status update within 7 days
- We will work with you on a fix timeline before any public disclosure

### Scope

In scope:
- L402 authentication bypass or macaroon forgery
- Payment logic errors (double-spend, underpayment acceptance, invoice reuse)
- API endpoint vulnerabilities (injection, SSRF, IDOR)
- Information disclosure (API keys, wallet credentials, user data)
- Denial of service against payment or API infrastructure

Out of scope:
- Rate limiting or resource exhaustion on free/public endpoints
- Self-XSS or issues requiring physical access
- Third-party service vulnerabilities (Blink, OpenNode, Replicate, etc.)
- Social engineering

### Safe harbor

We will not pursue legal action against researchers who:
- Act in good faith
- Avoid accessing or modifying other users' data
- Do not disrupt service availability
- Report findings privately before disclosure

## Supported Versions

Only the latest deployed version at https://sats4ai.com is supported. There are no LTS or backport branches.
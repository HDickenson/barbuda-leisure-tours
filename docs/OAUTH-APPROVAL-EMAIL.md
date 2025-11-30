# Email Template for OAuth Approval Request

**To**: support@anthropic.com
**Subject**: OAuth Token Approval Request - Claude Agent SDK for WordPress Migration Pipeline

---

Hi Anthropic Support Team,

I'm Harold Dickenson, a Claude Code subscriber, and I'm writing to request approval to use my Claude Code subscription OAuth token for programmatic API access through the Claude Agent SDK.

## What I'm Building

I've built a WordPress to Next.js migration pipeline using the Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`). The system uses MCP (Model Context Protocol) servers with 6 custom tools to automate website cloning, design system extraction, and component generation.

The complete implementation is ready (650+ lines), but it requires OAuth approval to authenticate.

## Why OAuth Instead of API Key?

1. I already have a Claude Code subscription
2. Want to avoid duplicate billing (subscription + API costs)
3. The Agent SDK has built-in OAuth support via the `oauthToken` parameter
4. Prefer unified authentication across development tools

## Technical Details

**OAuth Token**: Extracted from `~/.claude/.credentials.json`
**Token Format**: `sk-ant-oat01-...`
**Scopes**: `["user:inference"]`
**Usage**: Local development only, stored securely in `.env`

**Current Status**:
- Code works up to authentication
- Process hangs when trying to use OAuth token
- Error suggests token requires approval for third-party use

**Code Snippet**:
```typescript
const queryInstance = query({
  prompt: `Clone this website to Next.js...`,
  options: {
    mcpServers: { 'website-migration': mcpServer },
    oauthToken: process.env.CLAUDE_CODE_OAUTH_TOKEN
  }
});
```

## Use Case

**Development**: 10-20 requests/day for testing
**Production**: 1-5 sites/week (~500-1000 API calls/month)
**Purpose**: Automated WordPress to Next.js migrations for clients

## Questions

1. Is OAuth approval available for individual developers?
2. If yes, what's the approval process and timeline?
3. Are there usage limits or cost implications?
4. If no, should I use a separate API key instead?

## Alternative

If OAuth approval isn't available, I understand and will proceed with getting a separate Anthropic API key (estimated ~$5/site). I wanted to check first if my existing subscription could be used programmatically.

## Documentation

I've prepared a detailed request document if you need more information:
- Technical implementation details
- Security measures
- Business justification
- Repository structure

Happy to provide any additional information needed.

Thank you for considering this request!

Best regards,
Harold S. Dickenson Jr
[Your email]
[Your Claude Code account email if different]

---

**Attachments to Include**:
- `OAUTH-APPROVAL-REQUEST.md` (full technical details)
- Relevant code snippets from `agent-sdk.ts`
- Screenshot of OAuth token in `.credentials.json` (redacted)

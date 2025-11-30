# OAuth Approval Request for Anthropic

**Date**: 2025-10-30
**Requestor**: Harold S. Dickenson Jr (Kanousei)
**Project**: WordPress to Next.js Migration Pipeline using Claude Agent SDK

## Request Summary

I am requesting approval to use my Claude Code subscription OAuth token (`sk-ant-oat01-...`) for programmatic API access through the Claude Agent SDK in a custom automation pipeline.

## Project Details

### Overview
Building an automated WordPress to Next.js migration pipeline that:
- Crawls and analyzes WordPress sites
- Extracts design systems using Claude Vision API
- Generates pixel-perfect Next.js components
- Uses Claude Agent SDK with MCP (Model Context Protocol) servers

### Why OAuth Token Instead of API Key?

1. **Already have Claude Code subscription**: Currently paying for Claude Code access
2. **Avoid duplicate billing**: Don't want to pay for both subscription + API access
3. **Built for Agent SDK**: The pipeline uses `@anthropic-ai/claude-agent-sdk` which has OAuth support built-in
4. **Single authentication source**: Prefer unified authentication across development tools

### Technical Implementation

The orchestrator is fully built and ready:
- **File**: `apps/orchestrator/agent-sdk.ts` (650 lines)
- **Tools defined**: 6 MCP tools (scout, download_assets, check_coverage, extract_design_system, synthesize_pages, verify_build)
- **Authentication**: Uses `oauthToken` parameter in `query()` function
- **Current status**: Hangs at authentication (OAuth token not approved for third-party use)

### Code Snippet
```typescript
const queryInstance = query({
  prompt: `Clone this website to Next.js...`,
  options: {
    mcpServers: { 'website-migration': mcpServer },
    oauthToken: process.env.CLAUDE_CODE_OAUTH_TOKEN // Needs approval
  }
});
```

## Use Case Details

### Frequency
- **Development/testing**: 10-20 requests/day during development
- **Production**: 1-5 sites/week once deployed
- **Total volume**: ~500-1000 API calls/month

### Token Characteristics
- Extracted from: `~/.claude/.credentials.json`
- Format: `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`
- Scopes: `["user:inference"]`
- Subscription type: Claude Code Pro (or similar)

### Security Measures
- ✅ Token stored in `.env` file (gitignored)
- ✅ Never committed to version control
- ✅ Used only from local development machine
- ✅ Will rotate quarterly
- ✅ MCP server validates all inputs

## Business Justification

### Current Situation
- Spent 2 weeks trying to build with regular Claude API (didn't work well)
- Need contrasting approach using structured tool calling
- Already have Claude Code subscription for development
- Want to avoid paying $5-10/site for API access when already subscribed

### Alternative Considered
**Option**: Get separate Anthropic API key
**Cost**: ~$5/site + initial $5 testing = $10-50/month
**Issue**: Redundant cost on top of existing subscription

### Preferred Solution
Use OAuth token from existing subscription to avoid duplicate billing while using Claude's capabilities programmatically.

## Questions for Anthropic

1. **Is OAuth approval possible for individual developers?**
   - If yes, what's the approval process and timeline?
   - If no, what's the recommended approach?

2. **Are there usage limits for approved OAuth tokens?**
   - Rate limits?
   - Monthly quotas?
   - Cost implications?

3. **Can Claude Code subscription OAuth tokens be used with Agent SDK?**
   - Is the `oauthToken` parameter in `query()` only for Anthropic-internal use?
   - Or can third-party developers get approval?

4. **Alternative authentication methods?**
   - Is there a way to programmatically use Claude Code subscription without API keys?
   - Any upcoming features that would support this use case?

## Contact Information

- **Name**: Harold S. Dickenson Jr
- **Email**: [Your email]
- **GitHub**: [Your GitHub username if applicable]
- **Claude Code Account**: [Account email]

## Appendix: Technical Details

### Current Error
```bash
✅ Using Claude Code OAuth token (from subscription)
[Process hangs - no API response]
```

### Expected Behavior (with approval)
```bash
✅ Using Claude Code OAuth token (from subscription)

🤖 Claude Agent is working...

🔧 Using tool: scout
💬 Claude: Successfully crawled website...
[Pipeline continues through all 6 tools]
```

### Repository Structure
```
apps/
  orchestrator/
    agent-sdk.ts      # Claude Agent SDK implementation (OAuth)
    agent.ts          # Regular Anthropic SDK (API key fallback)
packages/
  types/             # TypeScript definitions
  validation/        # Zod schemas
  design-system/     # Design extraction logic
  page-synth/        # Component generation
```

## Conclusion

I have a fully-built, production-ready pipeline using the Claude Agent SDK that just needs OAuth approval to work. The alternative is to abandon this work and use a regular API key, duplicating my subscription costs.

I understand if OAuth approval is not available for individual developers. In that case, I'll proceed with the API key approach (Option 1 from findings document).

Thank you for considering this request.

---

**Submission Method**:
- [ ] Email to support@anthropic.com
- [ ] Submit via https://support.anthropic.com
- [ ] Post in Anthropic Discord #api-discussions
- [ ] Other: ___________________

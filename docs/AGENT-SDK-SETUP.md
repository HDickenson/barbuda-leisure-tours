# Claude Agent SDK Setup

The `agent-sdk.ts` file uses the Claude Agent SDK which provides a more advanced interface with tool calling and MCP server integration.

## Authentication Options

The Agent SDK supports two authentication methods:

### Option 1: Anthropic API Key (Recommended)

1. Get an API key from https://console.anthropic.com/settings/keys
2. Add to `.env`:
   ```bash
   ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
   ```
3. Run the pipeline:
   ```bash
   cd apps/orchestrator
   tsx agent-sdk.ts
   ```

### Option 2: OAuth Token (Advanced)

If you have a Claude Code subscription with OAuth access:

1. Get your OAuth token from your Claude Code subscription
2. Add to `.env`:
   ```bash
   CLAUDE_CODE_OAUTH_TOKEN=sk-ant-oat01-your-token-here
   ```
3. Run the pipeline:
   ```bash
   cd apps/orchestrator
   tsx agent-sdk.ts
   ```

## Differences from agent.ts

| Feature | agent.ts | agent-sdk.ts |
|---------|----------|--------------|
| API | Direct Anthropic SDK | Claude Agent SDK |
| Tool Calling | Manual implementation | SDK-managed |
| MCP Servers | Not supported | Supported |
| Streaming | Manual | SDK-managed |
| Error Handling | Manual | SDK-managed |
| Cost Tracking | Manual | Automatic |

## Running the Agent SDK Version

Once you have authentication configured:

```bash
# Run with TARGET_URL from .env
cd apps/orchestrator
tsx agent-sdk.ts

# Run with specific URL
cd apps/orchestrator
TARGET_URL=https://example.com tsx agent-sdk.ts
```

## Current Status

The agent-sdk.ts implementation is **ready to use** once you add a valid `ANTHROPIC_API_KEY` to your `.env` file.

The regular `agent.ts` file also works with the same API key and is simpler if you don't need MCP server support.

## Which Should I Use?

- **Use `agent.ts`** (via `pnpm run full`) if you want a simple, straightforward implementation
- **Use `agent-sdk.ts`** if you need:
  - MCP server integration
  - Advanced streaming features
  - Automatic cost tracking
  - Better error handling

Both require the same authentication credentials.

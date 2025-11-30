# MCP Code Execution Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              AGENT (LLM)                                 │
│  "Compare live and local site performance"                              │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ Writes Code (2k tokens)
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        CODE EXECUTION SANDBOX                            │
│                                                                          │
│  import * as chrome from './servers/chrome-devtools';                   │
│                                                                          │
│  const routes = ['/tours', '/about', '/contact'];                       │
│  for (const route of routes) {                                          │
│    await chrome.navigatePage({ url: live + route });                    │
│    await chrome.takeScreenshot({ filePath: `./live-${route}.png` });    │
│    await chrome.navigatePage({ url: local + route });                   │
│    await chrome.takeScreenshot({ filePath: `./local-${route}.png` });   │
│  }                                                                       │
│  console.log('Done! 6 screenshots saved.');                             │
│                                                                          │
└─────────────┬────────────────────────────────┬───────────────────────────┘
              │                                │
              │ Calls via MCP                  │ Writes to
              │                                │
              ▼                                ▼
┌──────────────────────────┐     ┌──────────────────────────┐
│   MCP CLIENT RUNTIME     │     │   ./workspace/           │
│   (mcp-runtime/client)   │     │   ├── live-tours.png     │
│                          │     │   ├── local-tours.png    │
│  - Manages connections   │     │   ├── live-about.png     │
│  - Calls MCP tools       │     │   ├── local-about.png    │
│  - Returns results       │     │   └── report.json        │
└────────────┬─────────────┘     └──────────────────────────┘
             │                              ▲
             │ stdio transport              │
             │                              │ Screenshots/data
             ▼                              │ never enter context
┌──────────────────────────┐               │
│  CHROME DEVTOOLS MCP     │               │
│  (chrome-devtools-mcp)   │───────────────┘
│                          │
│  - Puppeteer/CDP         │
│  - Browser automation    │
│  - 26 tools available    │
└────────────┬─────────────┘
             │
             │ Controls
             ▼
┌──────────────────────────┐
│    CHROME BROWSER        │
│    (headless)            │
│                          │
│  - Navigates pages       │
│  - Takes screenshots     │
│  - Records performance   │
│  - Monitors network      │
└──────────────────────────┘
```

## Data Flow Comparison

### Traditional (Direct Tool Calls)

```
Agent → listTools() → [26 tools × ~5k tokens each] = 130k tokens loaded
  ↓
Agent → take_screenshot(live_url)
  ↓
← Returns 500KB PNG in context (25k tokens)
  ↓
Agent → take_screenshot(local_url)
  ↓
← Returns 500KB PNG in context (25k tokens)
  ↓
Agent → compare(png1, png2)
  ↓
← Returns diff + metrics (10k tokens)

TOTAL: ~190,000 tokens consumed
```

### Code Execution Pattern

```
Agent discovers tools via filesystem:
  ls ./servers/chrome-devtools/
  cat ./servers/chrome-devtools/take_screenshot.ts
  
Total: ~2,000 tokens

Agent writes code (one request):
  import * as chrome from './servers/chrome-devtools';
  
  const live = await chrome.takeScreenshot({ 
    url: liveUrl, 
    filePath: './workspace/live.png' 
  });
  
  const local = await chrome.takeScreenshot({ 
    url: localUrl,
    filePath: './workspace/local.png'
  });
  
  const diff = compareFiles('./workspace/live.png', './workspace/local.png');
  console.log(`Diff: ${diff.score}`);

Code executes:
  - Screenshots saved to ./workspace/ (never enter context)
  - Comparison done in sandbox
  - Only console.log returns to agent

TOTAL: ~2,000 tokens consumed (98.7% reduction)
```

## Progressive Tool Discovery

Instead of loading all tools upfront:

```
1. Agent sees filesystem:
   ./servers/
   ├── chrome-devtools/
   │   ├── index.ts
   │   ├── navigate_page.ts
   │   ├── take_screenshot.ts
   │   └── ... (24 more)

2. Agent explores what it needs:
   > cat ./servers/chrome-devtools/index.ts
   
   Lists all available functions
   
3. Agent reads specific tools:
   > cat ./servers/chrome-devtools/navigate_page.ts
   
   export type NavigatePageInput = {
     type?: 'url' | 'back' | 'forward' | 'reload';
     url?: string;
     ...
   }
   
   export async function navigatePage(input) { ... }

4. Agent writes code using those tools

Only loads what it needs!
```

## Benefits Summary

| Aspect | Traditional | Code Execution | Improvement |
|--------|-------------|----------------|-------------|
| **Token Usage** | 150,000+ | ~2,000 | 98.7% ↓ |
| **Tool Loading** | All upfront | Progressive | Dynamic |
| **Data in Context** | All results | Only logs | 99% ↓ |
| **Control Flow** | Through agent | In code | Native |
| **Latency** | High (many requests) | Low (one request) | 10x faster |
| **Cost** | $1.50 per workflow | $0.02 per workflow | 75x cheaper |

## Key Architecture Points

1. **MCP Client** (`mcp-runtime/client.ts`)
   - Singleton connection manager
   - Connects to MCP servers via stdio
   - Provides `callMCPTool()` helper
   - Handles protocol responses

2. **Generated Wrappers** (`servers/chrome-devtools/*.ts`)
   - One file per tool
   - Typed inputs from JSON schema
   - JSDoc from tool descriptions
   - Clean async function API

3. **Code Generator** (`scripts/mcp-codegen.mjs`)
   - Introspects MCP servers
   - Generates TypeScript wrappers
   - Creates barrel exports
   - Regenerate anytime with `npm run mcp:codegen`

4. **Sandbox Environment** (`./workspace/`)
   - Filesystem for intermediate data
   - Screenshots, traces, reports
   - Data never enters agent context
   - Can be cleaned between runs

5. **Agent Harness** (Future: Task 5)
   - Accepts code from LLM
   - Executes in isolated environment
   - Captures console output
   - Returns only logs/errors to agent

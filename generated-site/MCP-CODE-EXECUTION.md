# MCP Code Execution Pattern

This implementation follows the pattern described in Anthropic's article:
[Code execution with MCP: Building more efficient agents](https://www.anthropic.com/engineering/code-execution-with-mcp)

## 🎯 Problem Solved

Traditional MCP usage loads all tool definitions into the LLM context and passes every intermediate result through the model. This:
- Consumes 150,000+ tokens for complex workflows
- Increases latency and costs
- Limits data that can be processed
- Forces data through the model context unnecessarily

## 💡 Solution: Code Execution with MCP

Instead of calling MCP tools directly, the LLM writes **code** that calls the tools. The code runs in an execution environment where:
- Tools are discovered progressively (load only what's needed)
- Data is filtered/transformed before context
- Intermediate results stay in the sandbox
- Complex control flow uses familiar code patterns

**Result: 98.7% token reduction** (150k → 2k tokens in Anthropic's example)

## 📁 Architecture

```
generated-site/
├── mcp-runtime/
│   └── client.ts           # MCP client helper with callMCPTool()
├── servers/                # Auto-generated tool wrappers
│   └── chrome-devtools/
│       ├── index.ts        # Barrel exports
│       ├── take_screenshot.ts
│       ├── navigate_page.ts
│       ├── list_network_requests.ts
│       └── ... (26 tools)
├── scripts/
│   ├── mcp-codegen.mjs     # Generator that introspects MCP servers
│   └── mcp-demo.mjs        # Demo showing the pattern in action
└── workspace/              # Sandbox filesystem (reports, screenshots, etc.)
```

## 🚀 Quick Start

### 1. Generate Tool Wrappers

Introspect your MCP servers and generate TypeScript wrappers:

```bash
npm run mcp:codegen
```

This reads `.mcp.json` and generates wrapper files in `servers/<server-name>/`.

### 2. Write Code Using Tools

Instead of direct tool calls, write code:

```typescript
import * as chrome from './servers/chrome-devtools';
import fs from 'fs/promises';

// Navigate and screenshot multiple pages
const routes = ['/tours', '/about', '/contact'];

for (const route of routes) {
  await chrome.navigatePage({ 
    type: 'url',
    url: `https://www.barbudaleisure.com${route}` 
  });
  
  await chrome.takeScreenshot({
    format: 'png',
    fullPage: true,
    filePath: `./workspace/screenshot-${route.replace(/\//g, '-')}.png`
  });
}

// Get network requests and filter in code (not context!)
const requests = await chrome.listNetworkRequests({});
const slowRequests = requests.filter(r => r.duration > 1000);
const totalSize = requests.reduce((sum, r) => sum + (r.responseSize || 0), 0);

// Only the summary goes back to the agent
console.log(`${slowRequests.length} slow requests, ${totalSize} bytes total`);
```

### 3. Run Demo

See the pattern in action:

```bash
# Performance analysis demo
npm run mcp:demo performance

# Visual QA demo
npm run mcp:demo visual
```

## 🔧 Implementation Details

### MCP Client (`mcp-runtime/client.ts`)

Manages connections to MCP servers via stdio transport:

```typescript
import { initMCPClient, callMCPTool } from './mcp-runtime/client.js';

// Initialize with server configs
initMCPClient({
  'chrome-devtools': {
    command: 'npx',
    args: ['-y', 'chrome-devtools-mcp@latest', '--headless=true']
  }
});

// Call tools using server__tool naming
const result = await callMCPTool('chrome-devtools__take_screenshot', {
  format: 'png',
  fullPage: true
});
```

### Code Generator (`scripts/mcp-codegen.mjs`)

Introspects MCP servers and generates TypeScript wrappers:

1. Reads `.mcp.json` configuration
2. Connects to each MCP server
3. Calls `listTools()` to get tool definitions
4. Generates typed wrapper files with:
   - Input types from JSON schema
   - JSDoc from tool descriptions
   - Typed async functions
   - Barrel index exports

### Tool Wrappers (`servers/chrome-devtools/*.ts`)

Each tool becomes a typed function:

```typescript
// Generated from MCP tool definition
export type TakeScreenshotInput = {
  format?: 'png' | 'jpeg' | 'webp';
  quality?: number;
  fullPage?: boolean;
  filePath?: string;
};

export async function takeScreenshot(
  input: TakeScreenshotInput
): Promise<TakeScreenshotResponse> {
  return callMCPTool<TakeScreenshotResponse>(
    'chrome-devtools__take_screenshot', 
    input
  );
}
```

## 📊 Benefits for This Project

### Before: Direct Tool Calls
```
Agent: "Compare live and local /tours page"
→ Tool: take_screenshot (live)
  ← Returns 500KB PNG in context
→ Tool: take_screenshot (local)  
  ← Returns 500KB PNG in context
→ Tool: compare_images
  ← Returns diff PNG + metrics in context

Total: ~150,000 tokens consumed
```

### After: Code Execution
```typescript
// Agent writes this code once:
const live = await chrome.takeScreenshot({ 
  url: 'https://www.barbudaleisure.com/tours',
  filePath: './workspace/live.png'
});

const local = await chrome.takeScreenshot({
  url: 'http://localhost:3000/tours', 
  filePath: './workspace/local.png'
});

// Images stay in workspace, never enter context
const diff = compareInSandbox('./workspace/live.png', './workspace/local.png');

console.log(`Diff score: ${diff.score}`);
// Only logs go back to agent

Total: ~2,000 tokens consumed (98.7% reduction)
```

## 🔐 Security Considerations

From [Anthropic's code sandboxing article](https://www.anthropic.com/engineering/claude-code-sandboxing):

- **Isolated execution**: Use Node VM, Docker, or Firecracker
- **Resource limits**: CPU, memory, network, filesystem quotas
- **Timeout protection**: Kill runaway processes
- **PII tokenization**: Optionally redact sensitive data at MCP boundary
- **Monitoring**: Log all code execution and MCP calls

## 🎯 Use Cases for Your Site

### 1. Visual QA
```typescript
const routes = ['/tours', '/tours/antigua', '/tours/barbuda'];
for (const route of routes) {
  await chrome.navigatePage({ url: `${liveBase}${route}` });
  const liveSS = await chrome.takeScreenshot({ fullPage: true });
  
  await chrome.navigatePage({ url: `${localBase}${route}` });
  const localSS = await chrome.takeScreenshot({ fullPage: true });
  
  // Compare in sandbox, report only diffs
}
```

### 2. Performance Audits
```typescript
await chrome.performanceStartTrace({});
await chrome.navigatePage({ url: site, type: 'reload' });
const trace = await chrome.performanceStopTrace({});

const requests = await chrome.listNetworkRequests({});
const slowOnes = requests.filter(r => r.duration > 1000);

// Only summary back to agent
console.log(`${slowOnes.length} slow requests found`);
```

### 3. Accessibility Checks
```typescript
const snapshot = await chrome.takeSnapshot({});
// Snapshot is a11y tree with element UIDs

const missingAlt = snapshot.elements.filter(el => 
  el.role === 'img' && !el.name
);

console.log(`${missingAlt.length} images missing alt text`);
```

## 📦 Generated Tools (Chrome DevTools MCP)

26 tools available:

**Navigation & Interaction:**
- `navigatePage` - Go to URL, back, forward, reload
- `newPage` - Create new browser tab
- `selectPage` - Switch active tab
- `closePage` - Close tab
- `click`, `hover`, `drag` - Element interactions
- `fill`, `fillForm` - Form inputs
- `pressKey` - Keyboard input
- `waitFor` - Wait for text to appear

**Inspection:**
- `takeScreenshot` - Capture PNG/JPEG/WebP
- `takeSnapshot` - A11y tree with element UIDs
- `listPages` - Get open tabs
- `listConsoleMessages` - Console logs/errors/warnings
- `listNetworkRequests` - Network activity
- `getConsoleMessage` - Get specific message
- `getNetworkRequest` - Get specific request

**Performance:**
- `performanceStartTrace` - Begin recording
- `performanceStopTrace` - End recording & get metrics
- `performanceAnalyzeInsight` - Detailed insights

**Advanced:**
- `evaluateScript` - Run JS in page context
- `emulate` - Device, viewport, geolocation, etc.
- `resizePage` - Change viewport size
- `uploadFile` - File input handling
- `handleDialog` - Alert/confirm/prompt

## 🔄 Workflow

1. **Agent receives task**: "Compare performance of live vs local site"
2. **Agent writes code** using `servers/chrome-devtools/*` tools
3. **Code executes in sandbox** with access to `./workspace`
4. **Intermediate data** (screenshots, network logs) stays in sandbox
5. **Only logs/results** flow back to agent context
6. **Agent sees summary** and can iterate or report completion

## 📝 Next Steps

- [ ] Task 4: Create sandbox execution environment (Node VM or Docker)
- [ ] Task 5: Build agent harness that accepts code from LLM and runs it
- [ ] Task 6: End-to-end test with live/local site comparison

## 🔗 References

- [Code execution with MCP (Anthropic)](https://www.anthropic.com/engineering/code-execution-with-mcp)
- [Code Mode (Cloudflare)](https://blog.cloudflare.com/code-mode/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP SDK for TypeScript](https://github.com/modelcontextprotocol/typescript-sdk)

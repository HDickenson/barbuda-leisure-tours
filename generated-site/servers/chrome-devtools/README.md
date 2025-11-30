# chrome-devtools MCP Server

Auto-generated TypeScript wrapper for the chrome-devtools MCP server.

## Available Tools

- `click` - Clicks on the provided element
- `closePage` - Closes the page by its index. The last open page cannot be closed.
- `drag` - Drag an element onto another element
- `emulate` - Emulates various features on the selected page.
- `evaluateScript` - Evaluate a JavaScript function inside the currently selected page. Returns the response as JSON
so returned values have to JSON-serializable.
- `fill` - Type text into a input, text area or select an option from a <select> element.
- `fillForm` - Fill out multiple form elements at once
- `getConsoleMessage` - Gets a console message by its ID. You can get all messages by calling list_console_messages.
- `getNetworkRequest` - Gets a network request by an optional reqid, if omitted returns the currently selected request in the DevTools Network panel.
- `handleDialog` - If a browser dialog was opened, use this command to handle it
- `hover` - Hover over the provided element
- `listConsoleMessages` - List all console messages for the currently selected page since the last navigation.
- `listNetworkRequests` - List all requests for the currently selected page since the last navigation.
- `listPages` - Get a list of pages open in the browser.
- `navigatePage` - Navigates the currently selected page to a URL.
- `newPage` - Creates a new page
- `performanceAnalyzeInsight` - Provides more detailed information on a specific Performance Insight of an insight set that was highlighted in the results of a trace recording.
- `performanceStartTrace` - Starts a performance trace recording on the selected page. This can be used to look for performance problems and insights to improve the performance of the page. It will also report Core Web Vital (CWV) scores for the page.
- `performanceStopTrace` - Stops the active performance trace recording on the selected page.
- `pressKey` - Press a key or key combination. Use this when other input methods like fill() cannot be used (e.g., keyboard shortcuts, navigation keys, or special key combinations).
- `resizePage` - Resizes the selected page's window so that the page has specified dimension
- `selectPage` - Select a page as a context for future tool calls.
- `takeScreenshot` - Take a screenshot of the page or element.
- `takeSnapshot` - Take a text snapshot of the currently selected page based on the a11y tree. The snapshot lists page elements along with a unique
identifier (uid). Always use the latest snapshot. Prefer taking a snapshot over taking a screenshot. The snapshot indicates the element selected
in the DevTools Elements panel (if any).
- `uploadFile` - Upload a file through a provided element.
- `waitFor` - Wait for the specified text to appear on the selected page.

## Usage

```typescript
import * as chromeDevtools from './servers/chrome-devtools';

// Example
const result = await chromeDevtools.click({
  // params
});
```

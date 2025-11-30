// ./servers/chrome-devtools/navigate_page.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type NavigatePageInput = {

  /** Navigate the page by URL, back or forward in history, or reload. */
  type?: 'url' | 'back' | 'forward' | 'reload';

  /** Target URL (only type=url) */
  url?: string;

  /** Whether to ignore cache on reload. */
  ignoreCache?: boolean;

  /** Maximum wait time in milliseconds. If set to 0, the default timeout will be used. */
  timeout?: number;
};

export interface NavigatePageResponse {
  [key: string]: any;
}

/**
 * Navigates the currently selected page to a URL.
 */
export async function navigatePage(input: NavigatePageInput): Promise<NavigatePageResponse> {
  return callMCPTool<NavigatePageResponse>('chrome-devtools__navigate_page', input);
}

// ./servers/chrome-devtools/close_page.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type ClosePageInput = {

  /** The index of the page to close. Call list_pages to list pages. */
  pageIdx: number;
};

export interface ClosePageResponse {
  [key: string]: any;
}

/**
 * Closes the page by its index. The last open page cannot be closed.
 */
export async function closePage(input: ClosePageInput): Promise<ClosePageResponse> {
  return callMCPTool<ClosePageResponse>('chrome-devtools__close_page', input);
}

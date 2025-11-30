// ./servers/chrome-devtools/select_page.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type SelectPageInput = {

  /** The index of the page to select. Call list_pages to list pages. */
  pageIdx: number;
};

export interface SelectPageResponse {
  [key: string]: any;
}

/**
 * Select a page as a context for future tool calls.
 */
export async function selectPage(input: SelectPageInput): Promise<SelectPageResponse> {
  return callMCPTool<SelectPageResponse>('chrome-devtools__select_page', input);
}

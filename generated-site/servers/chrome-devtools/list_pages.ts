// ./servers/chrome-devtools/list_pages.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type ListPagesInput = {

};

export interface ListPagesResponse {
  [key: string]: any;
}

/**
 * Get a list of pages open in the browser.
 */
export async function listPages(input: ListPagesInput): Promise<ListPagesResponse> {
  return callMCPTool<ListPagesResponse>('chrome-devtools__list_pages', input);
}

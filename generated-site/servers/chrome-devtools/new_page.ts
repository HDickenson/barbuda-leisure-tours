// ./servers/chrome-devtools/new_page.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type NewPageInput = {

  /** URL to load in a new page. */
  url: string;

  /** Maximum wait time in milliseconds. If set to 0, the default timeout will be used. */
  timeout?: number;
};

export interface NewPageResponse {
  [key: string]: any;
}

/**
 * Creates a new page
 */
export async function newPage(input: NewPageInput): Promise<NewPageResponse> {
  return callMCPTool<NewPageResponse>('chrome-devtools__new_page', input);
}

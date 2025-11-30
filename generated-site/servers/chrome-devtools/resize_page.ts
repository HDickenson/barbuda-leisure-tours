// ./servers/chrome-devtools/resize_page.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type ResizePageInput = {

  /** Page width */
  width: number;

  /** Page height */
  height: number;
};

export interface ResizePageResponse {
  [key: string]: any;
}

/**
 * Resizes the selected page's window so that the page has specified dimension
 */
export async function resizePage(input: ResizePageInput): Promise<ResizePageResponse> {
  return callMCPTool<ResizePageResponse>('chrome-devtools__resize_page', input);
}

// ./servers/chrome-devtools/hover.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type HoverInput = {

  /** The uid of an element on the page from the page content snapshot */
  uid: string;
};

export interface HoverResponse {
  [key: string]: any;
}

/**
 * Hover over the provided element
 */
export async function hover(input: HoverInput): Promise<HoverResponse> {
  return callMCPTool<HoverResponse>('chrome-devtools__hover', input);
}

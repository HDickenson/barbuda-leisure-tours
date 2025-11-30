// ./servers/chrome-devtools/fill.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type FillInput = {

  /** The uid of an element on the page from the page content snapshot */
  uid: string;

  /** The value to fill in */
  value: string;
};

export interface FillResponse {
  [key: string]: any;
}

/**
 * Type text into a input, text area or select an option from a <select> element.
 */
export async function fill(input: FillInput): Promise<FillResponse> {
  return callMCPTool<FillResponse>('chrome-devtools__fill', input);
}

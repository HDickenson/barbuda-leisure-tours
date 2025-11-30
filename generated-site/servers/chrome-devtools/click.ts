// ./servers/chrome-devtools/click.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type ClickInput = {

  /** The uid of an element on the page from the page content snapshot */
  uid: string;

  /** Set to true for double clicks. Default is false. */
  dblClick?: boolean;
};

export interface ClickResponse {
  [key: string]: any;
}

/**
 * Clicks on the provided element
 */
export async function click(input: ClickInput): Promise<ClickResponse> {
  return callMCPTool<ClickResponse>('chrome-devtools__click', input);
}

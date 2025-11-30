// ./servers/chrome-devtools/wait_for.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type WaitForInput = {

  /** Text to appear on the page */
  text: string;

  /** Maximum wait time in milliseconds. If set to 0, the default timeout will be used. */
  timeout?: number;
};

export interface WaitForResponse {
  [key: string]: any;
}

/**
 * Wait for the specified text to appear on the selected page.
 */
export async function waitFor(input: WaitForInput): Promise<WaitForResponse> {
  return callMCPTool<WaitForResponse>('chrome-devtools__wait_for', input);
}

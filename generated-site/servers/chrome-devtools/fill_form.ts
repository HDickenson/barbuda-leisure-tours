// ./servers/chrome-devtools/fill_form.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type FillFormInput = {

  /** Elements from snapshot to fill out. */
  elements: Array<{

  /** The uid of the element to fill out */
  uid: string;

  /** Value for the element */
  value: string;
}>;
};

export interface FillFormResponse {
  [key: string]: any;
}

/**
 * Fill out multiple form elements at once
 */
export async function fillForm(input: FillFormInput): Promise<FillFormResponse> {
  return callMCPTool<FillFormResponse>('chrome-devtools__fill_form', input);
}

// ./servers/chrome-devtools/evaluate_script.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type EvaluateScriptInput = {

  /** A JavaScript function declaration to be executed by the tool in the currently selected page.
Example without arguments: `() => {
  return document.title
}` or `async () => {
  return await fetch("example.com")
}`.
Example with arguments: `(el) => {
  return el.innerText;
}`
 */
  function: string;

  /** An optional list of arguments to pass to the function. */
  args?: Array<{

  /** The uid of an element on the page from the page content snapshot */
  uid: string;
}>;
};

export interface EvaluateScriptResponse {
  [key: string]: any;
}

/**
 * Evaluate a JavaScript function inside the currently selected page. Returns the response as JSON
so returned values have to JSON-serializable.
 */
export async function evaluateScript(input: EvaluateScriptInput): Promise<EvaluateScriptResponse> {
  return callMCPTool<EvaluateScriptResponse>('chrome-devtools__evaluate_script', input);
}

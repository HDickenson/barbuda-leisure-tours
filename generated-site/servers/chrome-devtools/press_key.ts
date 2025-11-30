// ./servers/chrome-devtools/press_key.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type PressKeyInput = {

  /** A key or a combination (e.g., "Enter", "Control+A", "Control++", "Control+Shift+R"). Modifiers: Control, Shift, Alt, Meta */
  key: string;
};

export interface PressKeyResponse {
  [key: string]: any;
}

/**
 * Press a key or key combination. Use this when other input methods like fill() cannot be used (e.g., keyboard shortcuts, navigation keys, or special key combinations).
 */
export async function pressKey(input: PressKeyInput): Promise<PressKeyResponse> {
  return callMCPTool<PressKeyResponse>('chrome-devtools__press_key', input);
}

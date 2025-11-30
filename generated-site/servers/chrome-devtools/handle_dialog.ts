// ./servers/chrome-devtools/handle_dialog.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type HandleDialogInput = {

  /** Whether to dismiss or accept the dialog */
  action: 'accept' | 'dismiss';

  /** Optional prompt text to enter into the dialog. */
  promptText?: string;
};

export interface HandleDialogResponse {
  [key: string]: any;
}

/**
 * If a browser dialog was opened, use this command to handle it
 */
export async function handleDialog(input: HandleDialogInput): Promise<HandleDialogResponse> {
  return callMCPTool<HandleDialogResponse>('chrome-devtools__handle_dialog', input);
}

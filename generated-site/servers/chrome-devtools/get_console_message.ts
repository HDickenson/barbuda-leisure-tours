// ./servers/chrome-devtools/get_console_message.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type GetConsoleMessageInput = {

  /** The msgid of a console message on the page from the listed console messages */
  msgid: number;
};

export interface GetConsoleMessageResponse {
  [key: string]: any;
}

/**
 * Gets a console message by its ID. You can get all messages by calling list_console_messages.
 */
export async function getConsoleMessage(input: GetConsoleMessageInput): Promise<GetConsoleMessageResponse> {
  return callMCPTool<GetConsoleMessageResponse>('chrome-devtools__get_console_message', input);
}

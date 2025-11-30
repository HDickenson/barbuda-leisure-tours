// ./servers/chrome-devtools/list_console_messages.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type ListConsoleMessagesInput = {

  /** Maximum number of messages to return. When omitted, returns all requests. */
  pageSize?: number;

  /** Page number to return (0-based). When omitted, returns the first page. */
  pageIdx?: number;

  /** Filter messages to only return messages of the specified resource types. When omitted or empty, returns all messages. */
  types?: Array<'log' | 'debug' | 'info' | 'error' | 'warn' | 'dir' | 'dirxml' | 'table' | 'trace' | 'clear' | 'startGroup' | 'startGroupCollapsed' | 'endGroup' | 'assert' | 'profile' | 'profileEnd' | 'count' | 'timeEnd' | 'verbose'>;

  /** Set to true to return the preserved messages over the last 3 navigations. */
  includePreservedMessages?: boolean;
};

export interface ListConsoleMessagesResponse {
  [key: string]: any;
}

/**
 * List all console messages for the currently selected page since the last navigation.
 */
export async function listConsoleMessages(input: ListConsoleMessagesInput): Promise<ListConsoleMessagesResponse> {
  return callMCPTool<ListConsoleMessagesResponse>('chrome-devtools__list_console_messages', input);
}

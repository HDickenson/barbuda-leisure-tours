// ./servers/chrome-devtools/drag.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type DragInput = {

  /** The uid of the element to drag */
  from_uid: string;

  /** The uid of the element to drop into */
  to_uid: string;
};

export interface DragResponse {
  [key: string]: any;
}

/**
 * Drag an element onto another element
 */
export async function drag(input: DragInput): Promise<DragResponse> {
  return callMCPTool<DragResponse>('chrome-devtools__drag', input);
}

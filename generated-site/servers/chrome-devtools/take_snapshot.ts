// ./servers/chrome-devtools/take_snapshot.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type TakeSnapshotInput = {

  /** Whether to include all possible information available in the full a11y tree. Default is false. */
  verbose?: boolean;

  /** The absolute path, or a path relative to the current working directory, to save the snapshot to instead of attaching it to the response. */
  filePath?: string;
};

export interface TakeSnapshotResponse {
  [key: string]: any;
}

/**
 * Take a text snapshot of the currently selected page based on the a11y tree. The snapshot lists page elements along with a unique
identifier (uid). Always use the latest snapshot. Prefer taking a snapshot over taking a screenshot. The snapshot indicates the element selected
in the DevTools Elements panel (if any).
 */
export async function takeSnapshot(input: TakeSnapshotInput): Promise<TakeSnapshotResponse> {
  return callMCPTool<TakeSnapshotResponse>('chrome-devtools__take_snapshot', input);
}

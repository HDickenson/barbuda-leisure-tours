// ./servers/chrome-devtools/get_network_request.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type GetNetworkRequestInput = {

  /** The reqid of the network request. If omitted returns the currently selected request in the DevTools Network panel. */
  reqid?: number;
};

export interface GetNetworkRequestResponse {
  [key: string]: any;
}

/**
 * Gets a network request by an optional reqid, if omitted returns the currently selected request in the DevTools Network panel.
 */
export async function getNetworkRequest(input: GetNetworkRequestInput): Promise<GetNetworkRequestResponse> {
  return callMCPTool<GetNetworkRequestResponse>('chrome-devtools__get_network_request', input);
}

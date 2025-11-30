// ./servers/chrome-devtools/list_network_requests.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type ListNetworkRequestsInput = {

  /** Maximum number of requests to return. When omitted, returns all requests. */
  pageSize?: number;

  /** Page number to return (0-based). When omitted, returns the first page. */
  pageIdx?: number;

  /** Filter requests to only return requests of the specified resource types. When omitted or empty, returns all requests. */
  resourceTypes?: Array<'document' | 'stylesheet' | 'image' | 'media' | 'font' | 'script' | 'texttrack' | 'xhr' | 'fetch' | 'prefetch' | 'eventsource' | 'websocket' | 'manifest' | 'signedexchange' | 'ping' | 'cspviolationreport' | 'preflight' | 'fedcm' | 'other'>;

  /** Set to true to return the preserved requests over the last 3 navigations. */
  includePreservedRequests?: boolean;
};

export interface ListNetworkRequestsResponse {
  [key: string]: any;
}

/**
 * List all requests for the currently selected page since the last navigation.
 */
export async function listNetworkRequests(input: ListNetworkRequestsInput): Promise<ListNetworkRequestsResponse> {
  return callMCPTool<ListNetworkRequestsResponse>('chrome-devtools__list_network_requests', input);
}

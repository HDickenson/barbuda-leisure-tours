// ./servers/chrome-devtools/performance_stop_trace.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type PerformanceStopTraceInput = {

};

export interface PerformanceStopTraceResponse {
  [key: string]: any;
}

/**
 * Stops the active performance trace recording on the selected page.
 */
export async function performanceStopTrace(input: PerformanceStopTraceInput): Promise<PerformanceStopTraceResponse> {
  return callMCPTool<PerformanceStopTraceResponse>('chrome-devtools__performance_stop_trace', input);
}

// ./servers/chrome-devtools/performance_start_trace.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type PerformanceStartTraceInput = {

  /** Determines if, once tracing has started, the page should be automatically reloaded. */
  reload: boolean;

  /** Determines if the trace recording should be automatically stopped. */
  autoStop: boolean;
};

export interface PerformanceStartTraceResponse {
  [key: string]: any;
}

/**
 * Starts a performance trace recording on the selected page. This can be used to look for performance problems and insights to improve the performance of the page. It will also report Core Web Vital (CWV) scores for the page.
 */
export async function performanceStartTrace(input: PerformanceStartTraceInput): Promise<PerformanceStartTraceResponse> {
  return callMCPTool<PerformanceStartTraceResponse>('chrome-devtools__performance_start_trace', input);
}

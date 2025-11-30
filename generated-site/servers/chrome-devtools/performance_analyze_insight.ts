// ./servers/chrome-devtools/performance_analyze_insight.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type PerformanceAnalyzeInsightInput = {

  /** The id for the specific insight set. Only use the ids given in the "Available insight sets" list. */
  insightSetId: string;

  /** The name of the Insight you want more information on. For example: "DocumentLatency" or "LCPBreakdown" */
  insightName: string;
};

export interface PerformanceAnalyzeInsightResponse {
  [key: string]: any;
}

/**
 * Provides more detailed information on a specific Performance Insight of an insight set that was highlighted in the results of a trace recording.
 */
export async function performanceAnalyzeInsight(input: PerformanceAnalyzeInsightInput): Promise<PerformanceAnalyzeInsightResponse> {
  return callMCPTool<PerformanceAnalyzeInsightResponse>('chrome-devtools__performance_analyze_insight', input);
}

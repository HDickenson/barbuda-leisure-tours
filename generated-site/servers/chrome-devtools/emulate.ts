// ./servers/chrome-devtools/emulate.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type EmulateInput = {

  /** Throttle network. Set to "No emulation" to disable. If omitted, conditions remain unchanged. */
  networkConditions?: 'No emulation' | 'Offline' | 'Slow 3G' | 'Fast 3G' | 'Slow 4G' | 'Fast 4G';

  /** Represents the CPU slowdown factor. Set the rate to 1 to disable throttling. If omitted, throttling remains unchanged. */
  cpuThrottlingRate?: number;
};

export interface EmulateResponse {
  [key: string]: any;
}

/**
 * Emulates various features on the selected page.
 */
export async function emulate(input: EmulateInput): Promise<EmulateResponse> {
  return callMCPTool<EmulateResponse>('chrome-devtools__emulate', input);
}

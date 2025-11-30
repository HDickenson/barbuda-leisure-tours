// ./servers/chrome-devtools/take_screenshot.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type TakeScreenshotInput = {

  /** Type of format to save the screenshot as. Default is "png" */
  format?: 'png' | 'jpeg' | 'webp';

  /** Compression quality for JPEG and WebP formats (0-100). Higher values mean better quality but larger file sizes. Ignored for PNG format. */
  quality?: number;

  /** The uid of an element on the page from the page content snapshot. If omitted takes a pages screenshot. */
  uid?: string;

  /** If set to true takes a screenshot of the full page instead of the currently visible viewport. Incompatible with uid. */
  fullPage?: boolean;

  /** The absolute path, or a path relative to the current working directory, to save the screenshot to instead of attaching it to the response. */
  filePath?: string;
};

export interface TakeScreenshotResponse {
  [key: string]: any;
}

/**
 * Take a screenshot of the page or element.
 */
export async function takeScreenshot(input: TakeScreenshotInput): Promise<TakeScreenshotResponse> {
  return callMCPTool<TakeScreenshotResponse>('chrome-devtools__take_screenshot', input);
}

// ./servers/chrome-devtools/upload_file.ts
import { callMCPTool } from "../../mcp-runtime/client.js";

export type UploadFileInput = {

  /** The uid of the file input element or an element that will open file chooser on the page from the page content snapshot */
  uid: string;

  /** The local path of the file to upload */
  filePath: string;
};

export interface UploadFileResponse {
  [key: string]: any;
}

/**
 * Upload a file through a provided element.
 */
export async function uploadFile(input: UploadFileInput): Promise<UploadFileResponse> {
  return callMCPTool<UploadFileResponse>('chrome-devtools__upload_file', input);
}

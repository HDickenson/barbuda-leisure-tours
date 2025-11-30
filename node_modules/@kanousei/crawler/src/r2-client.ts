import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';

export class R2Client {
  private client: S3Client;
  private bucket: string;

  constructor() {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error('Missing R2 credentials in environment');
    }

    this.bucket = 'clone-staging';
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async listPages(siteId: string): Promise<string[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: `${siteId}/pages/`,
    });

    const response = await this.client.send(command);
    return response.Contents?.map(obj => obj.Key!).filter(Boolean) || [];
  }

  async getPage(siteId: string, pageKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: pageKey,
    });

    const response = await this.client.send(command);
    if (!response.Body) throw new Error(`No body for ${pageKey}`);

    return await response.Body.transformToString();
  }

  async getState(siteId: string): Promise<any> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: `${siteId}/state.json`,
    });

    const response = await this.client.send(command);
    if (!response.Body) throw new Error(`No state for ${siteId}`);

    const text = await response.Body.transformToString();
    return JSON.parse(text);
  }
}

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  }
});

export async function putObject(Bucket: string, Key: string, Body: Buffer, ContentType?: string) {
  await r2.send(new PutObjectCommand({ Bucket, Key, Body, ContentType }));
  return { Bucket, Key };
}

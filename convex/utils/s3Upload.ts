import AWS from "aws-sdk";
import { mutation } from "../_generated/server";

// Initialize AWS S3 client
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const generateSignedUrl = mutation(async ({ ctx, args }: any) => {
  const { fileName, fileType } = args;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `logos/${fileName}`,
    ContentType: fileType,
    Expires: 60,
    ACL: "public-read",
  };

  // Generate signed URL
  const uploadUrl = await s3.getSignedUrlPromise("putObject", params);
  return { uploadUrl };
});

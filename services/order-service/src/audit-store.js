const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");

async function writeOrderAudit(order) {
  const bucketName = process.env.AWS_AUDIT_BUCKET;

  if (!bucketName) {
    return {
      stored: false,
      reason: "AWS_AUDIT_BUCKET is not configured"
    };
  }

  const client = new S3Client({
    region: process.env.AWS_REGION || "eu-west-1"
  });

  const objectKey = `orders/${order.id}.json`;

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: JSON.stringify(order),
      ContentType: "application/json",
      ServerSideEncryption: "AES256"
    })
  );

  return {
    stored: true,
    bucket: bucketName,
    key: objectKey
  };
}

module.exports = {
  writeOrderAudit
};

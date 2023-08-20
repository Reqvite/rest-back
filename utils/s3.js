const s3 = require('@aws-sdk/client-s3');
const presigner = require('@aws-sdk/s3-request-presigner');

const s3Client = new s3.S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const getSignedUrl = async (item) => {
  if (!item.picture) {
    item.picture = 'RESTio.png';
  }
  const getObjectParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: item.picture,
  };
  const command = new s3.GetObjectCommand(getObjectParams);
  return await presigner.getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

const deleteFromS3 = async (key) => {
  const deleteObjectParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };
  const command = new s3.DeleteObjectCommand(deleteObjectParams);
  await s3Client.send(command);
};

module.exports = { getSignedUrl, deleteFromS3 };

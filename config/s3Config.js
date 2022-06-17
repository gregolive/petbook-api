import s3 from 'aws-sdk/clients/s3.js';
import fs from 'fs';

const bucket = new s3({
  region: process.env.AWS_BUCKET_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const uploadFile = (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: fileStream,
    Key: file.filename,
  };

  return bucket.upload(uploadParams).promise();
};

const downloadFile = (fileKey) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: process.env.AWS_BUCKET_NAME,
  };

  return bucket.getObject(downloadParams).createReadStream();
};

const deleteFile = (fileKey) => {
  const deleteParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.deleteObject(deleteParams).promise();
};

export { uploadFile, downloadFile, deleteFile };

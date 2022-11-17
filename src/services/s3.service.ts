import { Injectable, Req, Res } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as sharp from 'sharp';

@Injectable()
export class S3Service {
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_KEY_SECRET,
  });

  async resize(file) {
    return sharp(file).resize(320).jpeg().toBuffer();
  }

  async uploadFile(file) {
    console.log("--uploadFile", file);
    const { originalname } = file;

    const resized = await this.resize(file.buffer);

    console.log("--resized", file);

    const fileLocation = await this.s3_upload(
      resized,
      this.AWS_S3_BUCKET,
      originalname,
      file.mimetype,
    );

    return {
      uri: fileLocation,
    };
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    try {
      const s3Response = await this.s3.upload(params).promise();

      return s3Response.Location;
    } catch (e) {
      console.log(e);
    }
  }
}

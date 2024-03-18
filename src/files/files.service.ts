import { Injectable } from "@nestjs/common";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";
import { Upload } from "@aws-sdk/lib-storage";

@Injectable()
export class FilesService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });
  }

  async uploadFile(file: Express.Multer.File, bucketName: string) {
    try {
      const uploadParams = {
        Bucket: bucketName,
        Key: `${Date.now()}-${file.originalname}`,
        Body: file.buffer
      };
      const command = new PutObjectCommand(uploadParams);
      const uploadResult = await this.s3Client.send(command);

      return uploadResult;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error('Error uploading file');
    }
  }

  async getSignedUrl(bucketName: string, fileName: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 1800 }); // Link expires in 30 minutes
      return signedUrl;
    } catch (error) {
      console.error('Error getting signed URL from S3:', error);
      throw new Error('Error getting signed URL');
    }
  }


  async renameFile(bucketName: string, oldFileName: string, newFileName: string): Promise<void> {
    try {
      const copyCommand = new CopyObjectCommand({
        Bucket: bucketName,
        CopySource: `${bucketName}/${oldFileName}`,
        Key: newFileName
      });
      await this.s3Client.send(copyCommand);

      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: oldFileName
      });

      await this.s3Client.send(deleteCommand)
    } catch (error) {
      console.error('Error renaming file in S3:', error);
      throw new Error('Error renaming file');
    }
  }


  async uploadFromUrlToS3(imageUrl: string, bucketName: string, fileName: string): Promise<void> {
    try {
      const { data: imageStream } = await axios({
        url: imageUrl,
        method: "GET",
        responseType: "stream"
      });

      const uploader = new Upload({
        client: this.s3Client,
        params: {
          Bucket: bucketName,
          Key: fileName,
          Body: imageStream
        }
      });

      await uploader.done();
    } catch (error) {
      console.error('Error uploading file from URL to S3:', error);
      throw new Error('Error uploading file from URL');
    }
  }

}

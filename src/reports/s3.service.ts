
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private readonly bucketName = process.env.AWS_DEFAULT_S3_BUCKET;

  // private configService : ConfigService;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_S3_REGION ?? '',
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.SECRET_ACCESS_KEY ?? '',
      },
    });

    // const s3 = new S3Client({
    //     region: this.configService.get('file.awsS3Region', { infer: true,}),
    //     credentials: {
    //         accessKeyId: this.configService.getOrThrow( 'file.accessKeyId',{ infer: true,}, ),
    //         secretAccessKey: this.configService.getOrThrow('file.secretAccessKey',{ infer: true,}, ),
    //     },
    // });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const key = `${folder}/${uuidv4()}-${file.originalname}`;
    
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    
    await this.s3.send(command);
    
    return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  async getFiles(){
    const load = {
        region: process.env.AWS_S3_REGION ?? '',
        credentials: {
          accessKeyId: process.env.ACCESS_KEY_ID ?? '',
          secretAccessKey: process.env.SECRET_ACCESS_KEY ?? '',
        },
    }

    console.log(load)

  }
}
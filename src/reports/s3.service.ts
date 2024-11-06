import {
    BadRequestException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
    private s3: S3Client;
    private readonly bucketName = process.env.AWS_S3_BUCKET_NAME;

    constructor() {
        this.s3 = new S3Client({
            region: process.env.AWS_S3_REGION ?? '',
            credentials: {
                accessKeyId: process.env.ACCESS_KEY_ID ?? '',
                secretAccessKey: process.env.SECRET_ACCESS_KEY ?? '',
            },
        });
    }

    async uploadFile(
        fileName: Express.Multer.File,
        file: Buffer,
        folder: string,
    ): Promise<string> {
        const key = `${folder}/${uuidv4()}-${fileName.originalname}`;
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file,
            ContentType: fileName.mimetype,
            ACL: 'public-read',
        });

        try {
            await this.s3.send(command);
            return `https://${this.bucketName}.s3.eu-north-1.amazonaws.com/${key}`;
        } catch (err) {
            console.log(err);
            throw new BadRequestException('Error uploading');
        }
    }

    async getFiles() {
        const load = {
            region: process.env.AWS_S3_REGION ?? '',
            credentials: {
                accessKeyId: process.env.ACCESS_KEY_ID ?? '',
                secretAccessKey: process.env.SECRET_ACCESS_KEY ?? '',
            },
        };

        console.log(load);
    }
}

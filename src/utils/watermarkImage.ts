import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import {
    FileFieldsInterceptor,
    FileInterceptor,
    FilesInterceptor,
} from '@nestjs/platform-express';

import sharp from 'sharp';
import * as path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import { promisify } from 'util';

export const watermarkImage = async (
    file: Express.Multer.File,
): Promise<Buffer> => {
    const watermarkPath = path.join(
        __dirname,
        '..',
        '..',
        'src',
        'public',
        'watermarks',
        'watermark.png',
    );

    const watermark = await sharp(watermarkPath)
        .resize(384 / 2, 156 / 2)
        .ensureAlpha(0.7)
        .toBuffer();

    return await sharp(file.buffer)
        .composite([{ input: watermark, gravity: 'northwest' }])
        .toBuffer();
};

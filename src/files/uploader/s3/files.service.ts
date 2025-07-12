import {
    HttpStatus,
    Injectable,
    UnprocessableEntityException,
} from '@nestjs/common';
import { FileRepository } from '../../persistence/file.repository';
import { FileType } from '../../domain/file';
import { FileResponseDto } from './dto/file-response.dto';

@Injectable()
export class FilesS3Service {
    constructor(private readonly fileRepository: FileRepository) {}

    async create(file: Express.MulterS3.File): Promise<FileResponseDto> {
        if (!file) {
            throw new UnprocessableEntityException({
                status: HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    file: 'select File',
                },
            });
        }

        const savedFile = await this.fileRepository.create({ path: file.key });

        return { file: savedFile };
    }
}

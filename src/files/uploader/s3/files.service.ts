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
            console.log('Error in file upload');
            throw new UnprocessableEntityException({
                status: HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    file: 'select File',
                },
            });
        }
        console.log('file entering file service');
        console.log(file);

        const savedFile = await this.fileRepository.create({ path: file.key });
        console.log('Saved File in File service ::: ', savedFile);

        return { file: savedFile };
    }
}

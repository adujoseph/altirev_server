import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { CreateResultsDto } from './dto/create-results.dto';
import { UpdateResultsDto } from './dto/update-results.dto';
import { ResultsRepository } from './infrastructure/persistence/results.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Results } from './domain/results';
import { UsersService } from '../users/users.service';
import { FilesLocalService } from '../files/uploader/local/files.service';
import { FilesService } from '../files/files.service';
import { S3Service } from '../reports/s3.service';
import { FilesS3Service } from '../files/uploader/s3/files.service';

@Injectable()
export class ResultsService {
    constructor(
        private readonly resultsRepository: ResultsRepository,
        private readonly userService: UsersService,
        private s3Service: S3Service,
        // private readonly s3FileService: FilesS3Service,
    ) {}

    async create(
        createResultsDto: CreateResultsDto,
        file: Express.Multer.File,
    ): Promise<Results> {
        const fileDriver = process.env.FILE_DRIVER;
        if (!fileDriver) {
            throw new InternalServerErrorException('File Driver not found');
        }

        if (!file) {
            throw new BadRequestException('Upload a file for evidence');
        }

        const user = await this.userService.findByAltirevId(
            createResultsDto.userAltirevId,
        );
        if (!user) {
            throw new UnauthorizedException('User with Altirev ID not found');
        }

        const fileUrl = await this.s3Service.uploadFile(file, 'File');

        return this.saveFileResult(createResultsDto, fileUrl);
    }

    findAllWithPagination({
        paginationOptions,
    }: {
        paginationOptions: IPaginationOptions;
    }) {
        return this.resultsRepository.findAllWithPagination({
            paginationOptions: {
                page: paginationOptions.page,
                limit: paginationOptions.limit,
            },
        });
    }

    findOne(id: Results['id']) {
        return this.resultsRepository.findById(id);
    }

    update(id: Results['id'], updateResultsDto: UpdateResultsDto) {
        return this.resultsRepository.update(id, updateResultsDto);
    }

    remove(id: Results['id']) {
        return this.resultsRepository.remove(id);
    }

    private async saveFileResult(
        createResultsDto: CreateResultsDto,
        fileUrl: string,
    ): Promise<Results> {
        console.log(createResultsDto);
        try {
            const result = {
                ...createResultsDto,
                fileUrl: fileUrl,
            };
            console.log(result);
            return await this.resultsRepository.create(result);
        } catch (error) {
            console.log(error);
        }
        return new Results();
    }
}

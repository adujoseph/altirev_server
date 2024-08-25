import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateResultsDto } from './dto/create-results.dto';
import { UpdateResultsDto } from './dto/update-results.dto';
import { ResultsRepository } from './infrastructure/persistence/results.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Results } from './domain/results';
import { UsersService } from '../users/users.service';
import { FilesS3Service } from '../files/uploader/s3/files.service';
import { FilesLocalService } from '../files/uploader/local/files.service';
import * as process from 'node:process';
import fileConfig from '../files/config/file.config';
import { FileConfig, FileDriver } from '../files/config/file-config.type';
import { FileType } from '../files/domain/file';
import { FilesLocalModule } from '../files/uploader/local/files.module';
import { FilesService } from '../files/files.service';

@Injectable()
export class ResultsService {
  constructor(
    private readonly resultsRepository: ResultsRepository,
    private readonly userService: UsersService,
    private fileService: FilesService,
    private readonly s3FileService: FilesS3Service,
    private readonly localFileService: FilesLocalService,
  ) {
  }

  async create(
    createResultsDto: CreateResultsDto,
    file: Express.MulterS3.File,
  ): Promise<Results> {
    const user = await this.userService.findByAltirevId(
      createResultsDto.userAltirevId,
    );
    if (!user) {
      throw new UnauthorizedException('User with Altirev ID not found');
    }

    const fileDriver = process.env.FILE_DRIVER;

    if (!fileDriver) {
      throw new InternalServerErrorException('File Driver not found');
    }

    console.log('lets save to s3');
    const s3FileResponse = await this.s3FileService.create(file);
    if (s3FileResponse) {
      console.log('lets save to results');
      return this.saveFileResult(createResultsDto, s3FileResponse.file);
    }

    return new Results();
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
    fileType: FileType,
  ): Promise<Results> {
    try {
      const result = {
        electionType: createResultsDto.electionType,
        accreditedVoters: createResultsDto.accreditedVoters,
        voteCasted: createResultsDto.voteCasted,
        counts: createResultsDto.counts,
        userAltirevId: createResultsDto.userAltirevId,
        fileData: fileType,
      };
      return await this.resultsRepository.create(result);
    } catch (error) {
      console.log(error);
    }
    return new Results();
  }
}

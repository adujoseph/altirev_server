import { Module } from '@nestjs/common';
import { RelationalFilePersistenceModule } from './persistence/relational-persistence.module';
import { FilesService } from './files.service';
import fileConfig from './config/file.config';
import { FileConfig, FileDriver } from './config/file-config.type';
import { FilesLocalModule } from './uploader/local/files.module';
import { FilesS3Module } from './uploader/s3/files.module';
import { FilesS3PresignedModule } from './uploader/s3-presigned/files.module';
import { FilesS3Service } from './uploader/s3/files.service';
import { FilesLocalService } from './uploader/local/files.service';
import { FilesS3PresignedService } from './uploader/s3-presigned/files.service';

const infrastructurePersistenceModule = RelationalFilePersistenceModule;

const infrastructureUploaderModule =
    (fileConfig() as FileConfig).driver === FileDriver.LOCAL
        ? FilesLocalModule
        : (fileConfig() as FileConfig).driver === FileDriver.S3
          ? FilesS3Module
          : FilesS3PresignedModule;

@Module({
    imports: [infrastructurePersistenceModule, FilesLocalModule, FilesS3Module],
    providers: [FilesService, FilesS3Service, FilesLocalService],
    exports: [
        FilesService,
        FilesS3Service,
        FilesLocalService,
        infrastructurePersistenceModule,
    ],
})
export class FilesModule {}

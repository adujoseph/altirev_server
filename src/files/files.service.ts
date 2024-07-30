import { Injectable } from '@nestjs/common';

import { FileRepository } from './persistence/file.repository';
import { FileType } from './domain/file';

@Injectable()
export class FilesService {
  constructor(private readonly fileRepository: FileRepository) {}

  findById(id: FileType['id']): Promise<any> {
    return this.fileRepository.findById(id);
  }
}

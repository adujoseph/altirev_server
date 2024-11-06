import { FileType } from '../domain/file';
import { NullableType } from '../../utils/types/nullable.type';

export abstract class FileRepository {
    abstract create(data: Omit<FileType, 'id'>): Promise<FileType>;

    abstract findById(id: FileType['id']): Promise<NullableType<FileType>>;
}

import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Results } from '../../domain/results';

export abstract class ResultsRepository {
    abstract create(
        data: Omit<Results, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<Results>;

    abstract findAllWithPagination({
        paginationOptions,
    }: {
        paginationOptions: IPaginationOptions;
    }): Promise<Results[]>;

    abstract findById(id: Results['id']): Promise<NullableType<Results>>;

    abstract findByElection(id: Results['election']['id']): Promise<Results>;

    abstract update(
        id: Results['id'],
        payload: DeepPartial<Results>,
    ): Promise<Results | null>;

    abstract remove(id: Results['id']): Promise<void>;

    abstract findByAgent(
        userAltirevId: Results['userAltirevId'],
    ): Promise<Results[]>;

    abstract findByTenantId(tenantId: Results['tenantId']): Promise<Results[]>;
}

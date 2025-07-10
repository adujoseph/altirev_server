import { CreateTenantDto } from "../../dto/create-tenant.dto";
import { Tenant } from "../../entities/tenant.entity";

export class TenantMapper {

    static toDomain(entity: Tenant): CreateTenantDto {
        const tenantDto = new CreateTenantDto();

        tenantDto.name = entity.name;
        tenantDto.moderatorEmail = entity.moderator;
        tenantDto.userCount = entity.userCount;

        return tenantDto;
    }

    static toPersistence(dto: CreateTenantDto): Tenant {
        const tenant = new Tenant();
        tenant.name = dto.name;
        tenant.moderator = dto.moderatorEmail;
        tenant.userCount = dto.userCount;
        return tenant;
    }
}
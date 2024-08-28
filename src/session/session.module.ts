import { Module } from '@nestjs/common';
import { RelationalSessionPersistenceModule } from './persistence/relational-persistence.module';
import { SessionService } from './session.service';

const infrastructurePersistenceModule = RelationalSessionPersistenceModule;

@Module({
    imports: [infrastructurePersistenceModule],
    providers: [SessionService],
    exports: [SessionService, infrastructurePersistenceModule],
})
export class SessionModule {}

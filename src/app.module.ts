import { Module } from '@nestjs/common';
import authConfig from './auth/config/auth.config';
import appConfig from './config/app.config';
import mailConfig from './mail/config/mail.config';
import fileConfig from './files/config/file.config';
import databaseConfig from './database/config/database.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
//Modules
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';
import { MailerModule } from './mailer/mailer.module';
import { MailModule } from './mail/mail.module';
// import { ElectionModule } from './election/election.module';
import { NotificationModule } from './notification/notification.module';
import { AdminModule } from './admin/admin.module';
import { ContactModule } from './contact/contact.module';
import { ResultsModule } from './results/results.module';
import { ElectionModule } from './election/election.module';
import { ReportsModule } from './reports/reports.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PlansModule } from './plans/plans.module';
import { TagsModule } from './tags/tags.module';
import { ElectionResultsModule } from './election-results/election-results.module';

import { AppDataSource } from './data-source';
import { DataSource } from 'typeorm';

AppDataSource.initialize()
  .then((dataSource) => {
    console.log('Data Source has been initialized!');
    console.log('Loaded Entities:', dataSource.entityMetadatas.map(e => e.name));
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [
                databaseConfig,
                authConfig,
                appConfig,
                mailConfig,
                fileConfig,
            ],
            envFilePath: ['.env'],
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false,
            autoLoadEntities: true,
            // logging: true
        }),
        SubscriptionsModule,
        UsersModule,
        FilesModule,
        AuthModule,
        SessionModule,
        MailModule,
        MailerModule,
        ElectionModule,
        NotificationModule,
        AdminModule,
        ContactModule,
        ResultsModule,
        ReportsModule,
        PlansModule,
        TagsModule,
        ElectionResultsModule,
    ],
})
export class AppModule {}

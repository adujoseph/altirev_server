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
import { LocationModule } from './location/location.module';

// const infrastructureDatabaseModule = TypeOrmModule.forRootAsync({
//   useClass: TypeOrmConfigService,
//   dataSourceFactory: async (options: DataSourceOptions) => {
//     return new DataSource(options).initialize();
//   },
// });

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

        // infrastructureDatabaseModule,

        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            // entities: [__dirname + '/**/*.schema{.ts,.js}'],
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
            autoLoadEntities: true,
        }),

        // I18nModule.forRootAsync({
        //   useFactory: (configService: ConfigService<AllConfigType>) => ({
        //     fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
        //       infer: true,
        //     }),
        //     // loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
        //   }),
        //   resolvers: [
        //     {
        //       use: HeaderResolver,
        //       useFactory: (configService: ConfigService<AllConfigType>) => {
        //         return [
        //           configService.get('app.headerLanguage', {
        //             infer: true,
        //           }),
        //         ];
        //       },
        //       inject: [ConfigService],
        //     },
        //   ],
        //   imports: [ConfigModule],
        //   inject: [ConfigService],
        // }),
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
        LocationModule,
    ],
})
export class AppModule {}

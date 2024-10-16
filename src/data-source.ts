import { DataSource } from 'typeorm';
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

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'your-db-host',     // e.g., 'localhost'
  port: Number(process.env.DATABASE_PORT) || 3306,
  username: process.env.DATABASE_USERNAME || 'your-db-username',
  password: process.env.DATABASE_PASSWORD|| 'your-db-password',
  database: process.env.DATABASE_NAME || 'your-database-name',
  entities: [__dirname + '/**/*.entity{.ts,.js}'], // Include all your entities here
  migrations: ['dist/migrations/*.js'], // Path to your migrations folder
  synchronize: false, // Set to false for production, true for dev
});
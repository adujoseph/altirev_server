import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'your-db-host',     // e.g., 'localhost'
  port: Number(process.env.DATABASE_PORT) || 3306,
  username: process.env.DATABASE_USERNAME || 'your-db-username',
  password: process.env.DATABASE_PASSWORD|| 'your-db-password',
  database: process.env.DATABASE_NAME || 'your-database-name',
  entities: [__dirname + '/**/*.entity{.ts,.js}'], // Include all your entities here
  migrations: ['dist/migrations/*.js'], // Path to your migrations folder
  synchronize: true, // Set to false for production, true for dev
});

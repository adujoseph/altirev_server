import { NestFactory } from '@nestjs/core';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import { log } from 'console';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3002,
      },
    },
  );
  // const config = new DocumentBuilder()
  //   .setTitle('Altirev Api')
  //   .setDescription('The API documentation for Altirev apps')
  //   .setVersion('1.0')
  //   .addTag('Users')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document, {
  //   jsonDocumentUrl: 'swagger/json',
  // });
  // hello nboys how are you all doing at the moment
  await app.listen();
}
bootstrap();

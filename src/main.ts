import 'dotenv/config';
import {
    ClassSerializerInterceptor,
    ValidationPipe,
    VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import validationOptions from './utils/validation-options';
import { AllConfigType } from './config/config.type';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';
import * as bodyParser from 'body-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    const configService = app.get(ConfigService<AllConfigType>);
    app.enableCors();
    app.enableShutdownHooks();
    app.setGlobalPrefix(
        configService.getOrThrow('app.apiPrefix', { infer: true }),
        {
            exclude: ['/'],
        },
    );
    app.enableVersioning({
        type: VersioningType.URI,
    });
      // Increase the request body size limit
  app.use(bodyParser.json({ limit: '50mb' })); // Adjust the size as needed
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.useGlobalPipes(new ValidationPipe(validationOptions));
    app.useGlobalInterceptors(
        // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
        // https://github.com/typestack/class-transformer/issues/549
        new ResolvePromisesInterceptor(),
        new ClassSerializerInterceptor(app.get(Reflector)),
    );

    const options = new DocumentBuilder()
        .setTitle('Altirev API')
        .setDescription('API documentation for Altirev Server')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);

    await app.listen(configService.getOrThrow('app.port', { infer: true }));
}
void bootstrap();

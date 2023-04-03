import { ValidationPipe } from '@nestjs/common'; //ojo: no import '@nestjs/common/pipes' esto genera error
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,    // transforma los parametros automaticamente segun el Dto
      transformOptions:{
        enableImplicitConversion: true,
      }
    })
  );
  await app.listen(process.env.PORT);
}
bootstrap();

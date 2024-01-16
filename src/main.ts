import { ValidationPipe } from '@nestjs/common'; //ojo: no import '@nestjs/common/pipes' esto genera error
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule, 
    new FastifyAdapter()
  );
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

//* En Caso de tener este erro 
/* Type 'NestFastifyApplication' does not satisfy the constraint 'INestApplication'.

Type 'NestFastifyApplication' is missing the following properties from type
'INestApplication': use, enableCors, enableVersioning, listenAsync, and 22 more */

//*Actualizar ls Dependecias
// yarn upgrade-interactive --latest
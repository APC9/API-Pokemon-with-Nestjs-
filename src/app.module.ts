import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { envConfiguration } from './config/env.config';
import { joiValidationSchema } from './config/joi.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ envConfiguration],
      validationSchema: joiValidationSchema,
    }), // se necesita para las variables de entorno, debe estar primero en la importacion
/*     ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'), // Servir contenido estatico
      }), */
    MongooseModule.forRoot(process.env.MONGO_DB), //conectar la BD
    PokemonModule, CommonModule, SeedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

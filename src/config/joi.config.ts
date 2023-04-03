import * as Joi from 'joi';

export const joiValidationSchema =  Joi.object({
  MONGO_DB: Joi.required(),
  PORT: Joi.number().default(3005),
  //ojo si no viene la variable de entorno, la asigna el default(6) pero como un string, si lo requiere como un numero debe colocar un signo + para convertirlo, ejemplo: +process.env.DEFAULT_LIMIT
  DEFAULT_LIMIT: Joi.number().default(6) 
})
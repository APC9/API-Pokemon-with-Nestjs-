export const envConfiguration = ()=>({
  enviroment: process.env.NODE_ENV || 'development',
  mongodb: process.env.MONGO_DB,
  port: process.env.PORT || 3000,
  defaultLimit: +process.env.DEFAULT_LIMIT || 20,
})
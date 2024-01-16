<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# API POKEMON 

1. Clonar el repositorio
2. Ejecutar

```
yarn install
```
3. Tener Nest CLI instalado

```
npm i -g @nestjs/cli
```

4. Levantar la base de datos

```
docker-compose up -d
```

5. Clonar el archivo __.env.template__ y renombrar la copia a __.env__

6. Llenar las variables de entorno definidas en el __.env__

7. Ejecutar la aplicacion en dev:

```
yarn start:dev
```

8. Reconstruir la base de datos con la semilla
```
http://localhost:3000/api/v2/seed
```

#  Production Build
1. Crear el archivo __.env.prod__
2. Llenar las variables de entorno de prod
3. Crear la nueva imagen de docker

```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

# RUN
una vez hecho el build se puede volver a levantar la imagen con el siguiente comando
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d
```

## Stack usado
* MongoDB
* Nestjs

## configuracion package.json para los test
 "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src", <!-- cambiar "src"  por "." para que todos los test unitarios enten en la carpeta test-->
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
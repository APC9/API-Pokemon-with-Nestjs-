import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { pokemonStub } from './src/pokemon/stub/pokemon.stub';
import { testModule, usePipes } from './test.module';
import { IPokemons } from '../src/seed/interfaces/poke-response.interfaces';
import { CreatePokemonDto } from '../src/pokemon/dto/create-pokemon.dto';
import { UpdatePokemonDto } from 'src/pokemon/dto/update-pokemon.dto';

describe('pokemonController (e2e)', () => {
  let app: INestApplication;
  const url = '/pokemon';

  const mockPokemons: IPokemons = {
      _id:  expect.any(String),
      name: expect.any(String),
      no:   expect.any(Number),
      __v:  expect.any(Number),
    }

  const newPokemon: CreatePokemonDto = {
    name: 'Nuevo Pokemon',
    no: 1991
  }
  
  const updatedPokemon: UpdatePokemonDto = {
    name: 'updated pokemon'
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await testModule.compile();

    app = moduleFixture.createNestApplication();
    usePipes(app);
    await app.init();
  });

  it('/ (POST)', async() => {
    const response = await request(app.getHttpServer())
    .post(url)
    .send({...newPokemon})
    .expect(201)
  
    expect(response.body).toEqual(mockPokemons)
  });

  it('/ (GET)', async() => {
    const response = await request(app.getHttpServer())
      .get(url)
      .expect( resp => { // se puede hecer todo aca directamente
        const data = resp.body[0];
        expect(data).toHaveProperty('name')
        expect(data).toHaveProperty('no')
        expect(data).toHaveProperty('_id')
      })
      .expect(200)

      // O con el objeto response
      expect(response.body[0]).toEqual(mockPokemons)
  });
  
  it('/ (GET/:term)', () => {
    return request(app.getHttpServer())
      .get(`${url}/${newPokemon.name}`)
      .expect( resp => {
        const data = resp.body;
        expect(data).toEqual(mockPokemons)
      })
      .expect(200)
  });

  it('/ (GET/:term) NotFoundException', () => {
    return request(app.getHttpServer())
      .get(`${url}/${updatedPokemon.name}`)
      .expect( resp => {
        const data = resp.body["message"];
        console.log('\x1b[92m', data)
        expect(data).toBe("Pokemon with id, name or no \"updated pokemon\" not found")
      })
      .expect(404)
  });

  it('/ (UPDATE)', () => {
    return request(app.getHttpServer())
      .patch(`${url}/${newPokemon.name}`)
      .send(updatedPokemon)
      .expect( resp => {
        const data = resp.body;
        expect(data).toEqual(updatedPokemon)
      })
      .expect(200)
  });

  it('/ (DELETE/:term)', async () => {
    const response = await request(app.getHttpServer())
    .get(`${url}/${updatedPokemon.name}`)

    const id = response.body['_id']

    return request(app.getHttpServer())
      .delete(`${url}/${id}`)
      .expect( resp => {
        const data = resp.text;
        expect(data).toBe('Delete ok!')
      })
      .expect(200)
  });


  afterAll(async () => {
    await app.close();
  });
});

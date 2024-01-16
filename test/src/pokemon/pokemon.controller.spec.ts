import { Test, TestingModule } from '@nestjs/testing';

import { PokemonController } from '../../../src/pokemon/pokemon.controller';
import { Pokemon } from '../../../src/pokemon/entities/pokemon.entity';
import { PokemonService } from '../../../src/pokemon/pokemon.service';
import { pokemonStub } from './stub/pokemon.stub';
import { PaginationDto } from '../../../src/common/dto/pagination.dto';


jest.mock('../../../src/pokemon/pokemon.service')

describe('PokemonController', () => {
  let pokemonController: PokemonController;
  let pokemonService: PokemonService;

  beforeEach( async () => {

    const app: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [PokemonService]
    }).compile();

    pokemonController = app.get<PokemonController>(PokemonController);
    pokemonService = app.get<PokemonService>(PokemonService);
    jest.clearAllMocks(); 
  });
  it('should be defined', () => {
    expect(pokemonController).toBeDefined();
  });

  describe('finOne', () => {
    let pokemon: Pokemon;
    const responseMock = { status: jest.fn() };

    beforeEach( async () => {
      pokemon = await pokemonController.findOne(responseMock, expect.any(String));
    })
    it('them it should call pokemonService.finOne', () => {
      expect(pokemonService.findOne).toHaveBeenCalledWith(expect.any(String))
    })
    it('them it should return pokemon', () => {
      expect(pokemon).toEqual(pokemonStub());
    })
  });

  describe('findAll', () => {
    let pokemons: Pokemon[];
    const responseMock = { status: jest.fn() };
    const paginationDto: PaginationDto = {
      limit: expect.any(Number),
      offset: expect.any(Number),
    }

    beforeEach( async () => {
      pokemons = await pokemonController.findAll(responseMock, paginationDto);
    })
    it('them it should call pokemonService.findAll', () => {
      expect(pokemonService.findAll).toHaveBeenCalled()
    })
    it('them it should return pokemons[]', () => {
      expect(pokemons).toEqual([pokemonStub()]);
    })
  });

  describe('create', () => {
    let pokemon: Pokemon;
    const responseMock = { status: jest.fn() };
    const createPokemonDto: Pokemon = {
      name: pokemonStub().name,
      no: pokemonStub().no
    } as Pokemon;

    beforeEach( async () => {
      pokemon = await pokemonController.create(responseMock, createPokemonDto);
    })
    it('them it should call pokemonService.create', () => {
      expect(pokemonService.create).toHaveBeenCalled()
      expect(pokemonService.create).toHaveBeenCalledWith(createPokemonDto)
    })
    it('them it should return pokemons', () => {
      expect(pokemon).toEqual(pokemonStub());
    })
  });

  describe('update', () => {
    let pokemon:{
      no?: number;
      name?: string;
    };
    
    const responseMock = { status: jest.fn() };
    const updatePokemonDto = {
      name: pokemonStub().name,
      no: pokemonStub().no
    };

    beforeEach( async () => {
      pokemon = await pokemonController.update(responseMock, pokemonStub().name, pokemonStub());
    })
    it('them it should call pokemonService.create', () => {
      expect(pokemonService.update).toHaveBeenCalled()
      expect(pokemonService.update).toHaveBeenCalledWith(pokemonStub().name, updatePokemonDto)
    })
    it('them it should return pokemons', () => {
      expect(pokemon).toEqual(pokemonStub());
    })
  });

  describe('remove', () => {
    let pokemon: string;

    const responseMock = { status: jest.fn() };

    beforeEach( async () => {
      pokemon = await pokemonController.remove(responseMock, expect.any(String));
    })
    it('them it should call pokemonService.create', () => {
      expect(pokemonService.remove).toHaveBeenCalled()
      expect(pokemonService.remove).toHaveBeenCalledWith(expect.any(String))
    })
    it('them it should return pokemons', () => {
      expect(pokemon).toEqual(expect.any(String));
    })
  });
});
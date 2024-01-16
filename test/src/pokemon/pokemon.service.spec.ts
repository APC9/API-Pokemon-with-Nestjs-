import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Model } from 'mongoose';

import { PokemonService } from '../../../src/pokemon/pokemon.service';
import { Pokemon } from '../../../src/pokemon/entities/pokemon.entity';
import { PaginationDto } from '../../../src/common/dto/pagination.dto';
import { pokemonStub } from './stub/pokemon.stub';
import { NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { UpdatePokemonDto } from 'src/pokemon/dto/update-pokemon.dto';

import { UpdateResult } from 'mongodb';



describe('PokemonService', () => {
  let pokemonService: PokemonService;
  let pokemonModel: Model<Pokemon>;

  const mockPokemonService = {
    find: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach( async () =>{
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers:[
        PokemonService,
        {
          provide: getModelToken(Pokemon.name),
          useValue: mockPokemonService,
        }
      ]
    }).compile();

    pokemonService = app.get<PokemonService>(PokemonService);
    pokemonModel = app.get<Model<Pokemon>>(getModelToken(Pokemon.name));
  });

  describe('findAll', ()=>{
    const paginationDto: PaginationDto = {
      limit: 5,
      offset: 0,
    }

    it('should return an array of Pokemons', async () => {
      jest.spyOn(pokemonModel, 'find').mockImplementation(
        () =>
        ({
          limit: () => ({
            skip: jest.fn().mockReturnValue([pokemonStub()]),
          }),
        } as any),
      )
      const pokemons = await pokemonService.findAll(paginationDto);
      expect(pokemons).toEqual([pokemonStub()])
      expect(pokemonModel.find).toHaveBeenCalled()
    })
  });

  describe('findOne', ()=>{
    it('must return to pokemon for the term:name', async () => {
      jest.spyOn(pokemonModel, 'findOne').mockResolvedValue(pokemonStub())
      const pokemons = await pokemonService.findOne(pokemonStub().name);
      expect(pokemons).toEqual(pokemonStub())
      expect(pokemonModel.findOne).toHaveBeenCalledWith({name: pokemonStub().name.toLowerCase() })
    })

    it('should throw NotFoundException if pokemon is not found', async () => {
      jest.spyOn(pokemonModel, 'findOne').mockResolvedValue(null)

      await expect(pokemonService.findOne(pokemonStub().name)).rejects.toThrow(
        NotFoundException,
      );

      expect(pokemonModel.findOne).toHaveBeenCalledWith({name: pokemonStub().name.toLowerCase() })
    });
  });

  describe('create', ()=>{

    const createPokemon:CreatePokemonDto = {
      name: pokemonStub().name,
      no: pokemonStub().no
    }
    it('must return to pokemon for the term:name', async () => {
      jest.spyOn(pokemonModel, 'create').mockImplementationOnce( () =>
        Promise.resolve({
          name: pokemonStub().name,
          no: pokemonStub().no
        } as any)  
      );
      const pokemon = await pokemonService.create(createPokemon);
      expect(pokemon).toEqual(pokemonStub())
      expect(pokemonModel.create).toHaveBeenCalledWith(createPokemon)
    })
  });
  describe('update', ()=>{

    it('must return NotFoundException', async () => {
      jest.spyOn(pokemonModel, 'updateOne').mockResolvedValue(pokemonModel.updateOne())
      await expect(pokemonService.update(pokemonStub().name.toLowerCase(), {...pokemonStub()})).rejects.toThrow(
        NotFoundException,
      );
    })
    it('pokemonService.update must have been called', async () => {
      jest.spyOn(pokemonModel, 'updateOne').mockResolvedValue(pokemonModel.updateOne())
      try {
        await pokemonService.update(pokemonStub().name.toLowerCase(), {...pokemonStub()})
        expect(pokemonModel.updateOne).toHaveBeenCalled()
        expect(pokemonModel.updateOne).toHaveBeenCalledWith(pokemonStub().name.toLowerCase(), {...pokemonStub()})
      } catch (error) {}
    })
  });

  describe('remove', ()=>{

    it(' pokemonService.remove must have been called', async () => {
      jest.spyOn(pokemonModel, 'deleteOne').mockReturnValue(expect.any(String))
      const resp = await pokemonService.remove(expect.any(String));
      expect(pokemonModel.deleteOne).toHaveBeenCalled();
      expect(pokemonModel.deleteOne).toHaveBeenCalledWith({_id: expect.any(String)});
    })
    it(' pokemonService.remove should return "Delete ok!"', async () => {
      jest.spyOn(pokemonModel, 'deleteOne').mockReturnValue(expect.any(String))
      const resp = await pokemonService.remove(expect.any(String));
      expect(resp).toBe("Delete ok!")
    })

  });

  
});
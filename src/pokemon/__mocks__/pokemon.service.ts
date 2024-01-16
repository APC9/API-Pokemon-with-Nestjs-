import { pokemonStub, stringPokemonStub } from '../../../test/src/pokemon/stub/pokemon.stub';


export const PokemonService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(pokemonStub()),
  findAll: jest.fn().mockReturnValue([pokemonStub()]),
  findOne: jest.fn().mockReturnValue(pokemonStub()),
  update: jest.fn().mockReturnValue(pokemonStub()),
  remove: jest.fn().mockReturnValue(stringPokemonStub()),
});
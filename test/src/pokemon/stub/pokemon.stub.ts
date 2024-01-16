import { Pokemon } from '../../../../src/pokemon/entities/pokemon.entity';

export const pokemonStub = ():Pokemon => {
  return {
    name: 'Picachu',
    no: 1
  } as Pokemon
}

export const stringPokemonStub = ():String => {
  return 'Pokemon delete'
}
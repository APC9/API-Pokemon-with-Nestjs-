import { MockModel } from '../../database/mock.model';
import { Pokemon } from '../../../../src/pokemon/entities/pokemon.entity';
import { pokemonStub } from './pokemon.stub';


export class PokemonModel extends MockModel<Pokemon> {
  protected entityStub: Pokemon = pokemonStub();
}
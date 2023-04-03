import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PokeResponse } from './interfaces/poke-response.interfaces';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    // curso Nest cap: 95 Custom provider
    private readonly http: AxiosAdapter
  ){}

  //forma optimizada de hacer 1 sola insercion de multiples datos
  async executeSeedOptimized(){
    await this.pokemonModel.deleteMany({}); // borrar todos 

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    const pokemonToInsert: {name: string, no: number}[] = [];

    data.results.forEach(({name, url})=>{
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      pokemonToInsert.push({name, no});
    });

    const pokemoms = await this.pokemonModel.insertMany(pokemonToInsert);
    return pokemoms;
  }


  //otra forma de hacer inserciones --- no es optimizado
  async executeSeed(){
    await this.pokemonModel.deleteMany({}); // borrar todos 

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=150');
    const insertPromisesArray = [];

    data.results.forEach(({name, url})=>{
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      insertPromisesArray.push(this.pokemonModel.create({name, no}));
    });

    const pokemoms = await Promise.all(insertPromisesArray);
    return pokemoms;
  }
}

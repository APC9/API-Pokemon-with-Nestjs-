import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  create( @Res({passthrough: true}) response, @Body() createPokemonDto: CreatePokemonDto) {
    const newPokemon = this.pokemonService.create(createPokemonDto);
    response.status(HttpStatus.CREATED);
    return newPokemon;
  }

  @Get()
  findAll( @Res({passthrough: true}) response,  @Query() paginationDto:PaginationDto ) { 
    const pokemons = this.pokemonService.findAll(paginationDto);
    response.status(HttpStatus.OK);
    return pokemons;
  }

  @Get(':term')
  findOne( @Res({passthrough: true}) response, @Param('term') term: string) {
    const pokemon =  this.pokemonService.findOne(term);
    response.status(HttpStatus.OK);
    return pokemon;
  }

  @Patch(':term')
  update( @Res({passthrough: true}) response, @Param('term') term: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    const pokemon = this.pokemonService.update(term, updatePokemonDto);
    response.status(HttpStatus.OK);
    return pokemon;
  }

  @Delete(':id')
  remove( @Res({passthrough: true}) response, @Param('id', ParseMongoIdPipe) id: string) {
    const pokemonDelete = this.pokemonService.remove(id);
    response.status(HttpStatus.OK);
    return pokemonDelete;
  }
}

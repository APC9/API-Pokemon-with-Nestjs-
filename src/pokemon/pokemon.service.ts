import { Injectable,InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findAll() {
    return  await this.pokemonModel.find();
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    
    //Buscar por nombre
    pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
    
    //Buscar por numero
    if ( !isNaN(+term) ) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    // Buscar por MongoID
    if ( !pokemon && isValidObjectId( term ) ) {
      pokemon = await this.pokemonModel.findById( term );
    }

    if ( !pokemon ) 
      throw new NotFoundException(`Pokemon with id, name or no "${ term }" not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    try {
      if ( updatePokemonDto.name )
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase(); 
      
      await pokemon.updateOne(updatePokemonDto);
  
      //esparce las propideades de pokemon y las sobre ecribe con updatePokemonDto
      return { ...pokemon.toJSON, ...updatePokemonDto} 
      
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async remove(id: string) {
    //const pokemon = await this.findOne(id);  
    //await pokemon.deleteOne();                                      1era manera de eliminar de la BD
    // const result = await  this.pokemonModel.findByIdAndDelete(id)  2da manera de eliminar de la BD
    
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id }) //forma recomendada 
    if(deletedCount === 0){
      throw new BadRequestException(`Pokemon with id ${id} not found`)
    }
    return 'Delete ok!';
  }

  private handleExceptions( error: any){
    if( error.code === 11000){
      throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error);
    throw new InternalServerErrorException('Can´t create pokemon - check server logs');
  }
}

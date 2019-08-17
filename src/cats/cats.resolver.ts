import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Cat } from '../graphql.schema';
// import { CatsGuard } from './cats.guard';
import { CatsService } from './cats.service';
// import { CreateCatDto } from './dto/create-cat.dto';

const pubSub = new PubSub();

@Resolver('Cat')
export class CatsResolvers {
  constructor(private readonly catsService: CatsService) { }

  // { getCats {name, age} }
  @Query()
  // @UseGuards(CatsGuard)
  async getCats() {
    return await this.catsService.findAll();
  }

  // { cat(_id: "5d5860d2c4173b28f4295f51") {name,age}}
  @Query('cat')
  async findOneById(@Args('_id') id: string): Promise<Cat> {
    return await this.catsService.findOneById(id);
  }

  // mutation{
  //   createCat(
  //     createCatInput:{name:"mimi", age:12}
  //   ) {name}
  // }
  @Mutation('createCat')
  async create(@Args('createCatInput') args: any): Promise<Cat> {
    const createdCat = await this.catsService.create(args);
    pubSub.publish('catCreated', { catCreated: createdCat });
    return createdCat;
  }

  @Subscription('catCreated')
  catCreated() {
    return pubSub.asyncIterator('catCreated');
  }
}

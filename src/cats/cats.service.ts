import { Injectable } from '@nestjs/common';
import { Cat } from '../graphql.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CatsService {

  constructor(@InjectModel('Cat') private readonly catModel: Model<any>) { }

  async create(cat: Cat): Promise<Cat> {
    return await this.catModel.create(cat).catch(err => err)
  }

  async findAll(): Promise<Cat[]> {
    return await this.catModel.find().exec();
  }

  async findOneById(id: string): Promise<Cat> {
    return await this.catModel.findById(id).exec();
  }
}

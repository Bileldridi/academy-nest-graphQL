import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<any>,
                @InjectModel('Coach') private readonly coachModel: Model<any>,
                @InjectModel('Candidate') private readonly candidateModel: Model<any>) { }

    findAll() {
        return this.userModel.find();
    }
    async findOneById(id: string): Promise<any> {
        return await this.userModel.findById(id).exec();
    }

    async create(user) {
        return await this.userModel.create(user).catch(err => err)
    }
    async login(user) {
        const res = await this.userModel.findOne({ email: user.email }).exec();
        if (!res) {
            return { message: 'User not found' };
        }
        const res2 = user.password === res.password;
        if (!res2) {
            return { message: 'Wrong Password' };
        }
        if (res.userStatus === 'Not Approved') {
            return { message: 'Not Approved' };
        }
        return this.createToken(res);
    }
    async validateUser(payload: any): Promise<any> {
        return await this.userModel.findOne({ email: payload.data.email, pass: payload.data.pass }).exec();
      }
      async createToken(user: any) {
        const expiresIn = 3600;
        user.password = null;
        return {
          message: 'OK',
          accessToken: jwt.sign({ data: user, exp: Math.floor(Date.now() / 1000) + (3600 * 24) }, 'secretKeeey'),
        };
      }
      async updateUser(user, _id) {
          console.log(user)
        const userResult = await this.userModel.findByIdAndUpdate({ _id }, user).catch(err => err);
        const coachResult = await this.coachModel.findByIdAndUpdate({ _id: userResult.coach }, user).catch(err => err);
        const result = await this.userModel.findOne({ _id }).exec();
        return this.createToken(result);
    }
}

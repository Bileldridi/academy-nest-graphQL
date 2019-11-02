import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly userModel: Model<any>) { }

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
        return res;
    }
}

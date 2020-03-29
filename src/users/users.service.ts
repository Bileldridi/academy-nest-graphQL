import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto-js';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<any>,
        @InjectModel('Coach') private readonly coachModel: Model<any>,
        @InjectModel('Candidate') private readonly candidateModel: Model<any>) { }

    findAll() {
        return this.userModel.find();
    }
    async findOneById(id: string): Promise<any> {
        return await this.userModel.findById(id).exec();
    }
    async findUserByEmail(email: string): Promise<any> {
        return await this.userModel.findOne({ email }).exec();
    }

    async create(user) {
        user.password = crypto.SHA256(user.password).toString();
        return await this.userModel.create(user).catch(err => err)
    }
    async login(user) {
        const res = await this.userModel.findOne({ email: user.email }).exec();
        if (!res) {
            return { message: 'User not found' };
        }

        const isPasswordCorrect = res.password === crypto.SHA256(user.password).toString();

        if (!isPasswordCorrect) {
            return { message: 'Wrong Password' };
        }
        // if (res.status === 'Not Approved') {
        //     return { message: 'Not Approved' };
        // }

        const result = this.createToken(res);
        console.log(result);
        return result;
    }
    async validateUser(payload: any): Promise<any> {
        console.log('payload', payload);

        return await this.userModel.findOne({ email: payload.data.email }).exec();
    }
    async createToken(user: any) {
        const expiresIn = 3600;
        user.password = null;
        return {
            message: 'OK',
            token: jwt.sign({ data: user, exp: Math.floor(Date.now() / 1000) + (3600 * 24) }, 'asd'),
        };
    }
    async updateUser(user, _id) {
        const userResult = await this.userModel.findByIdAndUpdate({ _id }, user).catch(err => err);
        const coachResult = await this.coachModel.findByIdAndUpdate({ _id: userResult.coach }, user).catch(err => err);
        const result = await this.userModel.findOne({ _id }).exec();
        return this.createToken(result);
    }
    async validate({ _id }): Promise<any> {
        const user = await this.userModel.findOne({ _id });
        if (!user) {
            throw Error('Authenticate validation error');
        }
        return user;
    }
    async recoverAccountRequest(email) {
        const user = await this.userModel.findOne({ email }).exec()
        if (!user) {
            return { message: 'Please check your info' }
        }
        const recoveryPass = Math.random().toString(36).slice(-30);
        const recoveryToken = jwt.sign({}, recoveryPass, { expiresIn: '12h' })
        console.log(recoveryPass);

        const result = await this.userModel.updateOne({ email }, { $set: { recoveryToken } }).exec()
        return result;
    }
    async recoverAccountCheck(email, recoveryPass, password) {
        console.log(email, recoveryPass, password);

        const user = await this.userModel.findOne({ email }).exec();
        const check = jwt.verify(user.recoveryToken, recoveryPass);
        if (!user || !check) {
            return { message: 'Please check your info' }
        }
        password = crypto.SHA256(password).toString();
        await this.userModel.updateOne({ email }, { $set: { password } }).exec();
        return { message: 'OK' };
    }
}

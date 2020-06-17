import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto-js';
import { sendEmailRecover, sendEmailAccess } from '../common/mailer/mailer';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<any>,
        @InjectModel('Coach') private readonly coachModel: Model<any>,
        @InjectModel('Candidate') private readonly candidateModel: Model<any>,
        @InjectModel('Cemetery') private readonly cemeteryModel: Model<any>,
    ) { }

    findAll() {
        return this.userModel.find().populate('candidate');
    }
    async findOneById(id: string): Promise<any> {
        const user = await this.userModel.findById(id).exec();

        return user;
    }
    async deleteUser(_id) {
        const result = await this.userModel.findOne({ _id }).exec();
        this.cemeteryModel.create({ object: result, type: 'Chapter' }).catch(err => err);
        await this.userModel.findByIdAndDelete(_id).exec();
        return result.id ? { message: 'OK' } : { message: 'NOT OK' }
    }
    async findUserByEmail(email: string): Promise<any> {
        return await this.userModel.findOne({ email }).exec();
    }

    async create(user) {
        let randomPass = '';
        if (!user.password) {
            randomPass = Math.random().toString(36).slice(-8);
            user['password'] = crypto.SHA256(randomPass).toString();
        } else {
            user.password = crypto.SHA256(user.password).toString();
            randomPass = '[YOUR OWN PASSWORD]';
        }
        if (user.sendEmail) {
            await sendEmailAccess(user.email, randomPass)
        }
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

        await this.userModel.updateOne({ email: user.email }, { $set: { lastLogin: Date.now() } }).exec()

        const result = this.createToken(res);

        return result;
    }
    async validateUser(payload: any): Promise<any> {
        // 

        return await this.userModel.findOne({ email: payload.data.email }).exec();
    }
    async createToken(user: any) {
        const expiresIn = 3600;
        user.password = null;
        return {
            message: 'OK',
            token: jwt.sign({ data: user, exp: Math.floor(Date.now() / 1000) + (3600 * 24) }, '9e14a20fd9e14a20fdcd049bba10340aa0de93ddc118c89e14a20'),
        };
    }
    async updateUser(user, _id) {
        const oldUser = await this.userModel.findOne({ _id }).exec();
        let pass = '';
        if (user.password === '') {
            user.password = oldUser.password;
        } else {
            user.password = crypto.SHA256(user.password).toString();
        }
        if (user.generate) {
            const randomPass = Math.random().toString(36).slice(-8);
            user.password = crypto.SHA256(randomPass).toString();
            console.log(randomPass);
            pass = randomPass
        }
        const userResult = await this.userModel.findByIdAndUpdate({ _id }, user).catch(err => err);
        const coachResult = await this.coachModel.findByIdAndUpdate({ _id: userResult.coach }, user).catch(err => err);
        const result = await this.userModel.findOne({ _id }).exec();
        if (user.sendEmail) {
            await sendEmailAccess(user.email, pass)
        }
        return result;
    }
    async findCheckpoints(_id) {
        const user = await this.userModel.findOne({ _id }).exec()
        return user.checkpoints;

    }
    async updateCheckpoint(_id, args) {
        const user = await this.userModel.findOne({ _id }).exec()
        if(user.checkpoints && user.checkpoints === []) {
            const userResult = await this.userModel.findByIdAndUpdate({ _id }, {$push:{checkpoints: args}}).catch(err => err);
        } else {
            const index = user.checkpoints.map(obj => {return obj.idCourse}).indexOf(args.idCourse);
            console.log(index);
            if(index !== -1) {
                console.log('mawjoud')
                user.checkpoints[index].idChapter = args.idChapter;
                const res1 = await this.userModel.findByIdAndUpdate({ _id }, {$set:{checkpoints: user.checkpoints}}).catch(err => err);
            } else {
                console.log('mouch mawjoud');
                const res2 = await this.userModel.findByIdAndUpdate({ _id }, {$push:{checkpoints: args}}).catch(err => err);
            }
        }
        return []
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
        const recoveryToken = jwt.sign({}, recoveryPass, { expiresIn: '12h' });
        const result = await this.userModel.updateOne({ email }, { $set: { recoveryToken } }).exec()
        sendEmailRecover(user.email, recoveryPass)
        return { message: 'OK' };
    }
    async recoverAccountCheck(email, recoveryPass, password) {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            return { message: 'Please check your info' }
        }
        if (user.recoveryToken === null) {
            return { message: 'wrong url' }
        }
        const check = jwt.verify(user.recoveryToken, recoveryPass);
        if (!user || !check) {
            return { message: 'Please check your info' }
        }
        password = crypto.SHA256(password).toString();
        await this.userModel.updateOne({ email }, { $set: { password, recoveryToken: null } }).exec();
        return { message: 'OK' };
    }
}

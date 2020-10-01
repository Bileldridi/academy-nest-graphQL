import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto-js';
import { sendEmailRecover, sendEmailAccess } from '../common/mailer/mailer';
import { sendOneTimeAccess } from '../common/mailer/singleLinkMailer'
import { updateProfileMail } from '../common/mailer/updateProfileMailer'
import { banProfileMailer } from '../common/mailer/banProfileMailer'
import { unbanProfileMailer } from '../common/mailer/unbanProfileMailer'

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<any>,
        @InjectModel('Course') private readonly courseModel: Model<any>,
        @InjectModel('Coach') private readonly coachModel: Model<any>,
        @InjectModel('Candidate') private readonly candidateModel: Model<any>,
        @InjectModel('Cemetery') private readonly cemeteryModel: Model<any>,
        @InjectModel('Settings') private readonly settingsModel: Model<any>,
        @InjectModel('Ban') private readonly banModel: Model<any>,
    ) { }

    async findAll() {
        return await this.userModel.find().populate('candidate').populate('banHistory').exec();

    }
    async findAllUsers(obj) {
        const { scroll, role, searchText } = obj
        let count = await this.userModel.countDocuments({ role })
        let users = await this.userModel.find({ role }).limit(scroll).populate('candidate').populate('banHistory').exec();
        if (searchText !== '') {
            users = await this.userModel.find({
                role,
                $or: [{ email: { $regex: searchText, $options: 'i' } },
                { firstname: { $regex: searchText, $options: 'i' } }, { lastname: { $regex: searchText, $options: 'i' } }]

            }).limit(scroll).populate('candidate').populate('banHistory').exec();
            count = users.length
        }
        return { users, count }

    }

    // async filterUsers(search) {
    //     const { searchText, role } = search
    //     let allUsers = await this.userModel.find({ role })


    //     return allUsers;
    // }

    async findOneById(id: string): Promise<any> {
        const user = await this.userModel.findById(id).populate('banHistory').exec();

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
        const unique = await this.userModel.findOne({ email: user.email }).exec()
        if (unique) return { message: 'email already in use' }

        if (!user.password) {
            randomPass = Math.random().toString(36).slice(-8);
            user['password'] = crypto.SHA256(randomPass).toString();
        } else {
            randomPass = user.password;
            user.password = crypto.SHA256(user.password).toString();
        }
        const newUser = await this.userModel.create(user).catch(err => err)

        if (user.sendEmail) {
            // await sendEmailAccess(user.email, randomPass)
            let code = "";
            const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < 16; i++) {
                code += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            const settings = await this.settingsModel.create({ code })
            await this.userModel.findByIdAndUpdate(newUser._id, { status: 'blocked' })
            // user.status = 'blocked'
            await this.settingsModel.findByIdAndUpdate(settings._id, { user: newUser._id })

            const link = `https://app.academy.fivepoints.fr/auth/login/${code}`
            // const link = `http://localhost:4200/auth/login/${code}`
            await sendOneTimeAccess(user.email, randomPass, link)
        }

        return newUser;
    }

    async register(user) {
        const unique = await this.userModel.findOne({ email: user.email }).exec()
        if (unique) { return { message: 'email already in use' } }
        // const code = Math.random().toString(36).slice(-14);
        let code = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 16; i++) {
            code += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        const settings = await this.settingsModel.create({ code })

        const pass = user.password

        user.password = crypto.SHA256(user.password).toString();
        user.status = 'blocked'
        const newUser = await this.userModel.create(user).catch(err => err)
        await this.settingsModel.findByIdAndUpdate(settings._id, { user: newUser._id })

        const link = `https://app.academy.fivepoints.fr/auth/login/${code}`
        // const link = `http://localhost:4200/auth/login/${code}`
        await sendOneTimeAccess(user.email, pass, link)

        return { message: 'user created successfully' }
    }

    async firstLogin(obj) {
        const verifCode = await this.settingsModel.findOne({ code: obj.code })
        if (!verifCode) return
        // { message: 'thank you for using the login form to access the platform' }
        const res = await this.userModel.findById(verifCode.user).exec();
        if (!res) {
            return { message: 'User not found' };
        }
        await this.userModel.updateOne({ email: res.email }, { $set: { lastLogin: Date.now() }, status: 'active' }).exec()
        await this.settingsModel.deleteOne({ _id: verifCode._id })
        const result = this.createToken(res);

        return result;
    }

    async login(user) {
        const res = await this.userModel.findOne({ email: { $regex: new RegExp("^" + user.email.toLowerCase(), "i") } }).exec();
        if (!res) {
            return { message: 'User not found' };
        }

        const isPasswordCorrect = res.password === crypto.SHA256(user.password).toString();

        if (!isPasswordCorrect) {
            return { message: 'Wrong Password' };
        }
        if (res.status === 'blocked') {
            return { message: 'Your account needs to be activated' };
        }
        if (res.status === 'banned') {
            return { message: 'Your account is banned' };
        }

        await this.userModel.updateOne({ email: user.email }, { $set: { lastLogin: Date.now() } }).exec()

        const result = this.createToken(res);

        return result;
    }
    async validateUser(payload: any): Promise<any> {
        // 

        return await this.userModel.findOne({ _id: payload.data.id }).exec();
    }
    async createToken(user: any) {
        const expiresIn = 3600;
        // user.password = null;
        // user['checkpoints'] = null;
        // user.recoveryToken = null;
        // user.lastLogin = null;
        // user.note = null;
        // user.createDate = null;
        const object = {
            id: user._id,
            firstname: user.firstname, lastname: user.lastname, email: user.email,
            image: user.image, tel: user.tel, status: user.status, role: user.role,
            coach: user.coach, candidate: user.candidate
        }
        return {
            message: 'OK',
            token: jwt.sign({ data: object, exp: Math.floor(Date.now() / 1000) + (3600 * 24 * 365) }, '9e14a20fd9e14a20fdcd049bba10340aa0de93ddc118c89e14a20'),
        };
    }

    async updateUser(user, _id) {
        const oldUser = await this.userModel.findOne({ _id }).exec();
        let pass = '';
        if (user.password === '') {
            user.password = oldUser.password;
        } else {
            pass = user.password
            user.password = crypto.SHA256(user.password).toString();
        }

        if (!user.image) {
            user.image = oldUser.image
        }
        const userResult = await this.userModel.findByIdAndUpdate({ _id }, user).catch(err => err);
        await this.coachModel.findByIdAndUpdate({ _id: userResult.coach }, user).catch(err => err);

        const updatedUser = await this.userModel.findOne({ _id }).exec();
        const newToken = this.createToken(updatedUser);
        if (user.sendEmail) {
            await updateProfileMail(user.email, pass)
        }
        return { updatedUser, newToken };
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

    async userStatus(id, reason?) {
        const user = await this.userModel.findOne({ _id: id })

        if (user.status === 'active') {
            const ban = await this.banModel.create({ user: id, banReason: reason })
            await this.userModel.findByIdAndUpdate(id, { status: 'banned', $push: { banHistory: ban._id } }, { new: true })
            await banProfileMailer(reason, user.email)
            return { message: `user Banned` }
        } else if (user.status === 'banned') {
            const ban = await this.banModel.find({ user: id }).sort({ _id: -1 }).limit(1)
            await this.banModel.findByIdAndUpdate(ban[0]._id, { unBanned: { status: true, unbanDate: new Date() } })
            await this.userModel.findByIdAndUpdate(id, { status: 'active' }, { new: true })
            await unbanProfileMailer(user.email)
            return { message: `user Unbanned` }
        }
    }

    async multiUsersStatus(args) {
        console.log(args);

        const ids = args[0].id.split(',').map(e => e.replace('\'', ''));
        const reason = args[0].reason
        for (const id of ids) {
            this.userStatus(id, reason)
        }

    }

    async createBanToken(user: any) {
        const object = {
            id: user._id,
            status: user.status,
        }
        return {
            message: 'OK',
            token: jwt.sign({ data: object, exp: Math.floor(Date.now() / 1000) + 300 }, '9e14a20fd9e14a20fdcd049bba10340aa0de93ddc118c89e14a20'),
        };
    }

    // async getBan(_id) {
    //     return await this.banModel.findById(_id);
    // }

    // async getAllBans() {
    //     return await this.banModel.find();
    // }
}

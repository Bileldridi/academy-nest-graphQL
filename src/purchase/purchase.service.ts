import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto-js';
import { sendEmailAccess } from '../common/mailer/mailer';

@Injectable()
export class PurchaseService {
    constructor(
        @InjectModel('Order') private readonly orderModel: Model<any>,
        @InjectModel('Cemetery') private readonly cemeteryModel: Model<any>,
        @InjectModel('User') private readonly userModel: Model<any>,
        @InjectModel('Access') private readonly accessModel: Model<any>,
    ) { }

    async findAllOrders() {
        return await this.orderModel.find().populate('course').populate('level').exec();
    }
    async findOneOrderById(_id) {
        return await this.orderModel.findOne({ _id }).populate('course').populate('level').exec();
    }
    async deleteOrder(_id) {
        const result = await this.orderModel.findOne({ _id }).exec();
        this.cemeteryModel.create({ object: result, type: 'Order' }).catch(err => err);
        return result.id ? { message: 'OK' } : { message: 'NOT OK' }
    }
    async createOrder(order) {
        order.orderId = this.makeid(7);
        order.status = { status: order.status };
        order.payment = { mode: order.mode, transfereId: '-', method: order.method };
        const result = await this.orderModel.create(order).catch(err => err);
        return result.id ? { message: 'OK' } : { message: 'NOT OK' }
    }
    async updateOrder(order, _id) {
        const result = await this.orderModel.findByIdAndUpdate({ _id }, { $push: { status: { status: order.status } } })
            .populate('course').populate('level').catch(err => err);
        let user = await this.userModel.findOne({ email: result.email }).exec();
        console.log(user);
        if (order.status === 'payed' && !user) {
            const newUser = await this.userModel.create(result).exec();
            console.log(newUser);
            user = newUser;
        }
        if (order.status === 'payed') {
            await this.accessModel.create({
                candidate: user.id, course: result.course.id, duration: result.course.duration
            }).catch(err => err);
        }
        return result.id ? { message: 'OK' } : { message: 'NOT OK' }
    }
    makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
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
}

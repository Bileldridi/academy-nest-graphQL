import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PurchaseService {
    constructor(
        @InjectModel('Order') private readonly orderModel: Model<any>,
    ) { }

    async findAllOrders() {
        return await this.orderModel.find().populate('course').populate('level').exec();
    }
    async findOneOrderById(_id) {
        return await this.orderModel.findOne({ _id }).populate('course').populate('level').exec();
    }
    async createOrder(order) {
        order.orderId = this.makeid(7);
        const result = await this.orderModel.create(order).catch(err => err);
        return result.id ? { message: 'OK' } : { message: 'NOT OK' }
    }
    async updateOrder(order, _id) {
        return await this.orderModel.findByIdAndUpdate({ _id }, order).catch(err => err);
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
}

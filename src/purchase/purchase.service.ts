import { CoursesService } from './../courses/courses.service';
import { Injectable, HttpService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto-js';
import { sendEmailAccess, sendEmailInvoice, sendOrderCreation } from '../common/mailer/mailer';

@Injectable()
export class PurchaseService {
    constructor(
        @InjectModel('Order') private readonly orderModel: Model<any>,
        @InjectModel('Cemetery') private readonly cemeteryModel: Model<any>,
        @InjectModel('User') private readonly userModel: Model<any>,
        @InjectModel('Access') private readonly accessModel: Model<any>,
        @InjectModel('Course') private readonly courseModel: Model<any>,
        @InjectModel('Level') private readonly levelModel: Model<any>,
        private httpService: HttpService,
        private coursesService: CoursesService,
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
        await this.orderModel.findByIdAndDelete(_id).exec();
        return result.id ? { message: 'OK' } : { message: 'NOT OK' }
    }
    async createOrder(order) {
        // console.log('createOrder')
        order.orderId = this.makeid(7);
        order.status = [{ status: "waitingPayment" }];
        const product = order.course ? await this.courseModel.findOne({ _id: order.course }).exec() : await this.levelModel.findOne({ _id: order.level }).exec()
        if (product.promotion && product.promotion !== 0) {
            order.payment = {
                mode: order.mode,
                transfereId: '-',
                method: order.method,
                amount: order.assistance ? (product.price - ((product.price * order.promotion) / 100)) + product.assistancePrice : (product.price - ((product.price * order.promotion) / 100))
            };
        } else {
            order.payment = {
                mode: order.mode, transfereId: '-',
                method: order.method,
                amount: order.assistance ? product.price + product.assistancePrice : product.price
            };
        }
        const result = await this.orderModel.create(order).catch(err => err);
        // // console.log(result);

        // if(result.id) {
        //     sendOrderCreation(order,result.id);
        // }
        if (order.mode == "transfere") {
            // sendOrderCreation(order, result.id, product);
        }
        return result.id ? { message: order.orderId } : { message: "NOT OK" }
    }
    async updateOrder(order, _id) {
        const result = await this.orderModel.findByIdAndUpdate({ _id }, { $push: { status: { status: order.status } } })
            .populate('course').populate('level').catch(err => err);
        let user = await this.userModel.findOne({ email: result.email }).exec();
        if (order.status === 'payed' && !user) {
            const newUser = await this.create(result).catch(err => err)//.exec();
            // console.log(newUser);
            // sendEmailAccess(newUser.email, newUser.password);
            user = newUser;
        }
        if (order.status === 'payed') {
            if (result.course) {
                await this.coursesService.createAccess({
                    candidate: user.id, course: result.course.id, duration: -1 },user);
                // await this.accessModel.create({
                //     candidate: user.id, course: result.course.id, duration: -1}).catch(err => err);
            } else if (result.level) {
                await this.coursesService.createAccess({
                    candidate: user.id, level: result.level.id, duration: -1}, user);
                // await this.accessModel.create({
                //     candidate: user.id, level: result.level.id, duration: -1 //result.course.duration
                // }).catch(err => err);
            } else {
                await this.coursesService.createAccess({candidate: user.id, module: result.module.id, duration: -1},user);
                // await this.accessModel.create({
                //     candidate: user.id, module: result.module.id, duration: -1 //result.course.duration
                // }).catch(err => err);
            }
            // await sendEmailInvoice(user.email,
            //     result.orderId,
            //     new Date(result.createDate).toLocaleDateString(),
            //     user.firstname + ' ' + user.lastname,
            //     result.course ? result.course.title : result.level.title,
            //     result.payment.amount, 'TND'
            // )
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

    async updateOrderFromPaymentGpg(order) {
        const result = await this.orderModel.findOneAndUpdate({ orderId: order.orderId }, { $push: { status: { status: order.status } } })
            .populate('course').populate('level').catch(err => err);
        let user = await this.userModel.findOne({ email: result.email }).exec();
        if (order.status === 'payed' && !user) {
            const newUser = await this.create(result).catch(err => err)//.exec();
            // console.log(newUser);
            user = newUser;
        }
        if (order.status === 'payed') {
            if (result.course) {
                await this.accessModel.create({
                    candidate: user.id, course: result.course.id, duration: -1 //result.course.duration
                }).catch(err => err);
            } else {
                await this.accessModel.create({
                    candidate: user.id, level: result.level.id, duration: -1 //result.course.duration
                }).catch(err => err);
            }
            await sendEmailInvoice(user.email,
                result.orderId,
                new Date(result.createDate).toLocaleDateString(),
                user.firstname + ' ' + user.lastname,
                result.course ? result.course.title : result.level.title,
                result.payment.amount, 'TND'
            )
        }
        return result.id ? { message: 'OK' } : { message: 'NOT OK' }
    }

    async create(user) {
        let newUser = { firstname: user.firstname, lastname: user.lastname, email: user.email, tel: user.tel, password: '' }
        let randomPass = '';
        randomPass = Math.random().toString(36).slice(-8);
        newUser.password = crypto.SHA256(randomPass).toString();
        sendEmailAccess(user.email, randomPass)
        // console.log('NEW UESER', newUser);
        return await this.userModel.create(newUser).catch(err => err)
    }
}

import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    course: { type: Types.ObjectId, ref: 'Course' },
    level: { type: Types.ObjectId, ref: 'Level' },
    createDate: { type: Number, default: Date.now },
    orderId: { type: String, unique: true },
    assistance: Boolean,
    firstname: String,
    lastname: String,
    email: String,
    promotion: {type: Number, default: 0},
    tel: String,
    zip: String,
    city: String,
    country: String,
    status: [
        {
            createDate: { type: Number, default: Date.now },
            status: { type: String, default: 'waitingPayment', enum: ['waitingPayment', 'payed', 'canceled', 'refunded', 'paymentError'] }
        }
    ],
    payment: {
        amount: Number,
        createDate: { type: Number, default: Date.now },
        transfereId: String,
        method: String,
        currency: String,
        mode: {
            type: String, enum: ['transfere', 'online']
        }
    }
});
schema.virtual('id').get(function () {
    return this._id.toHexString();
});
schema.set('toJSON', {
    virtuals: true,
});
export const OrderSchema = schema;

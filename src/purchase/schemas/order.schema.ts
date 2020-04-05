import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    course: { type: Types.ObjectId, ref: 'Course' },
    level: { type: Types.ObjectId, ref: 'Level' },
    createDate: { type: Number, default: Date.now() },
    orderId: { type: String, unique: true },
    assistance: Boolean,
    firstname: String,
    lastname: String,
    email: String,
    tel: String,
    zip: String,
    city: String,
    country: String,
    status: { type: String, default: 'waitingPayment', enum: ['waitingPayment', 'Payed', 'canceled', 'refunded', 'paymentError'] },
});
schema.virtual('id').get(function () {
    return this._id.toHexString();
});
schema.set('toJSON', {
    virtuals: true,
});
export const OrderSchema = schema;

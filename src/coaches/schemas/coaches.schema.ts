import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    tel: String,
    image: String,
    createDate: { type: Number, default: Date.now },
});
schema.virtual('id').get(function () {
    return this._id.toHexString();
});
schema.set('toJSON', {
    virtuals: true,
});
export const CoachSchema = schema;

import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    type: String,
    object: Object,
    createDate: { type: Number, default: Date.now() },
});
schema.virtual('id').get(function () {
    return this._id.toHexString();
});
schema.set('toJSON', {
    virtuals: true,
});
export const CemeterySchema = schema;

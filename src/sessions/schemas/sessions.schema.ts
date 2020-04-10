import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    period: Number,
    name: { type: String },
    type: { type: String },
    createDate: { type: Number, default: Date.now },
    startedDate: { type: Number },
    finishDate: { type: Number },
    candidates: [{ type: Types.ObjectId, ref: 'User' }],
    coaches: [{ type: Types.ObjectId, ref: 'User' }],
});
schema.virtual('id').get(function () {
    return this._id.toHexString();
});
schema.set('toJSON', {
    virtuals: true,
});
export const SessionSchema = schema;

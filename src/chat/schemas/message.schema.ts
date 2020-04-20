import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    sender: { type: Types.ObjectId, ref: 'User' },
    readBy: [{ type: Types.ObjectId, ref: 'User' }],
    content: String,
    type: { type: String, default: 'text', enum: ['text', 'image'] },
    createDate: { type: Number, default: Date.now },
});
schema.virtual('id').get(function () {
    return this._id.toHexString();
});
schema.set('toJSON', {
    virtuals: true,
});
export const MessageSchema = schema;

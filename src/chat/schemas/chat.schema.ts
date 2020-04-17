import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    creator: { type: Types.ObjectId, ref: 'User' },
    users: [{ type: Types.ObjectId, ref: 'User' }],
    messages: [{ type: Types.ObjectId, ref: 'Message' }],
    lastMessage: { type: Types.ObjectId, ref: 'Message' },
    conference: { type: Types.ObjectId, ref: 'Conference' },
    readBy: [{ type: Types.ObjectId, ref: 'User' }],
    title: String,
    createDate: { type: Number, default: Date.now },
    updateDate: { type: Number, default: Date.now },
});
schema.virtual('id').get(function () {
    return this._id.toHexString();
});
schema.set('toJSON', {
    virtuals: true,
});
export const ChatSchema = schema;

import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    author: { type: Types.ObjectId, ref: 'user' },
    content: String,
    status: String,
    createDate: { type: Number, default: Date.now() },

});

export const CommentSchema = schema;

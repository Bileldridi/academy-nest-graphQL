import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    author: { type: Types.ObjectId, ref: 'User' },
    content: String,
    status: { type: String, enum: ['draft', 'published', 'deleted'] },
    createDate: { type: Number, default: Date.now },

});

export const CommentSchema = schema;

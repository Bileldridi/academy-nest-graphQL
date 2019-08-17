import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    title: String,
    content: String,
    comments: [{ type: Types.ObjectId, ref: 'comment' }],
    level: { type: Types.ObjectId, ref: 'level' },
    createDate: { type: Number, default: Date.now() },
    status: String,
    Files: [String],
});

export const CourseSchema = schema;

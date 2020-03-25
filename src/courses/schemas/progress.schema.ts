import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    talent: { type: Types.ObjectId, ref: 'user' },
    chapter: { type: Types.ObjectId, ref: 'Chapter' },
    type: { type: String, enum: ['challenge', 'course', 'quiz'] },
    score: { type: Number, default: 0, max: 5, min: 0 },
    desc: String,
    createDate: { type: Number, default: Date.now() },
});

export const ProgressSchema = schema;
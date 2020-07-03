import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    candidate: { type: Types.ObjectId, ref: 'user' },
    chapter: { type: Types.ObjectId, ref: 'Chapter' },
    type: { type: String, enum: ['challenge', 'course', 'quiz'] },
    path: { type: Types.ObjectId, ref: 'Level' },
    bootcamp: { type: Types.ObjectId, ref: 'Module' },
    advancement: { type: Number },
    score: { type: Number, default: 0, min: 0 },
    desc: String,
    createDate: { type: Number, default: Date.now },
});

export const ProgressSchema = schema;

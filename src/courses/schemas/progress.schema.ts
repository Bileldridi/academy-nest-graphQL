import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    candidate: { type: Types.ObjectId, ref: 'User' },
    chapter: { type: Types.ObjectId, ref: 'Chapter' },
    type: { type: String, enum: ['challenge', 'course', 'quiz','level', 'module'] },
    score: { type: Number, default: 0, min: 0 },
    desc: String,
    createDate: { type: Number, default: Date.now },
    course: { id: {type: Types.ObjectId, ref: 'Course'}, lastChapter: { type: Types.ObjectId, ref: 'Chapter' }, checkedChapters: [{ type: Types.ObjectId, ref: 'Chapter' }] },
    path: { type: Types.ObjectId, ref: 'Level' },
    bootcamp: { type: Types.ObjectId, ref: 'Module' },
    progress: { type: Number, default: 0 }
});

export const ProgressSchema = schema;

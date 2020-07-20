import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    candidate: { type: Types.ObjectId, ref: 'User' },
    chapter: { type: Types.ObjectId, ref: 'Chapter' },
    type: { type: String, enum: ['challenge', 'course', 'quiz','level', 'module'] },
    path: { idPath: {type: Types.ObjectId, ref: 'Level'}, actualCourse: {type: Types.ObjectId, ref: 'Course'}, advance: {type: Number, default: 0}  },
    bootcamp: { idModule: {type: Types.ObjectId, ref: 'Module'}, actualPath: {type: Types.ObjectId, ref: 'Level'}, advance: {type: Number, default: 0} },
    advancement: { type: Number },
    score: { type: Number, default: 0, min: 0 },
    desc: String,
    createDate: { type: Number, default: Date.now },
});

export const ProgressSchema = schema;

import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    talent: { type: Types.ObjectId, ref: 'user' },
    coach: { type: Types.ObjectId, ref: 'user' },
    challenge: String,
    course: { type: Types.ObjectId, ref: 'course' },
    type: { type: String, enum: ['challenge', 'course'] },
    level: { type: Types.ObjectId, ref: 'level' },
    score: String,
    desc: String,
    createDate: { type: Number, default: Date.now() },

});

export const ProgressSchema = schema;

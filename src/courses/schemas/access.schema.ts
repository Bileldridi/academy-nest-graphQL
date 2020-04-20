import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    candidate: { type: Types.ObjectId, ref: 'User' },
    course: { type: Types.ObjectId, ref: 'Course' },
    progress: { type: Types.ObjectId, ref: 'Progress' },
    type: { type: String, default: 'purchase', enum: ['purchase', 'extension', 'free', 'test'] },
    level: { type: Types.ObjectId, ref: 'Level' },
    desc: String,
    createDate: { type: Number, default: Date.now },
    duration: {type: Number, default: -1},
    status: { type: String, default: 'active', enum: ['expired', 'active', 'deleted'] },

});

export const AccessSchema = schema;

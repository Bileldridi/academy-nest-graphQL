import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    title: String,
    courses: [{ type: Types.ObjectId, ref: 'Course' }],
    desc: String,
    status: { type: String, default: 'published', enum: ['draft', 'published', 'deleted'] },
    duration: { type: Number, default: 0 },
    createDate: { type: Number, default: Date.now },
});

export const LevelSchema = schema;

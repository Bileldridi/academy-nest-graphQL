import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    title: String,
    subTitle: String,
    desc: String,
    shortDesc: String,
    pic: String,
    price: { type: Number, default: 0 },
    courses: [{ type: Types.ObjectId, ref: 'Course' }],
    status: { type: String, default: 'private', enum: ['draft', 'private', 'published', 'deleted'] },
    duration: { type: Number, default: 0 },
    createDate: { type: Number, default: Date.now },
});

export const LevelSchema = schema;

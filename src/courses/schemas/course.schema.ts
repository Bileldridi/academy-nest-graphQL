import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    title: String,
    desc: String,
    chapters: [{ type: Types.ObjectId, ref: 'Chapter' }],
    comments: [{ type: Types.ObjectId, ref: 'Comment' }],
    levels: [{ type: Types.ObjectId, ref: 'Level' }],
    createDate: { type: Number, default: Date.now() },
    duration: { type: Number, default: 0 },
    status: { type: String, default: 'published', enum: ['draft', 'published', 'deleted'] },
    difficulty: { type: String, default: 'beginner', enum: ['beginner', 'intermediate', 'expert'] },
    longDesc: String,
    pic: String,
    price: { type: Number, default: 0 },
    assistancePrice: { type: Number, default: 0 },
    files: [String],
});

export const CourseSchema = schema;

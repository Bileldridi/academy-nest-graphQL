import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    title: String,
    desc: String,
    chapters: [{ type: Types.ObjectId, ref: 'Chapter' }],
    comments: [{ type: Types.ObjectId, ref: 'Comment' }],
    levels: [{ type: Types.ObjectId, ref: 'Level' }],
    duration: { type: Number, default: -1 },
    createDate: { type: Number, default: Date.now },
    status: { type: String, default: 'published', enum: ['draft', 'published', 'deleted', 'coming soon'] },
    difficulty: { type: String, default: 'beginner', enum: ['beginner', 'intermediate', 'expert'] },
    promotion: {type: Number, default: 0},
    longDesc: String,
    pic: String,
    price: { type: Number, default: 0 },
    assistancePrice: { type: Number, default: 0 },
    files: [String],
});

export const CourseSchema = schema;

import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    title: String,
    content: String,
    type: { type: String, default: 'text', enum: ['text', 'video', 'slides', 'quiz', 'project'] },
    comments: [{ type: Types.ObjectId, ref: 'Comment' }],
    course: { type: Types.ObjectId, ref: 'Course' },
    createDate: { type: Number, default: Date.now() },
    status: { type: String, default: 'published', enum: ['draft', 'published', 'deleted'] },
    Files: [String],
});

export const ChapterSchema = schema;

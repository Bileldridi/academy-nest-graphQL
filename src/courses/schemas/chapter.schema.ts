import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    title: String,
    content: String,
    type: { type: String, default: 'text', enum: ['text', 'video', 'slides', 'quiz', 'project'] },
    comments: [{ type: Types.ObjectId, ref: 'Comment' }],
    course: { type: Types.ObjectId, ref: 'Course' },
    createDate: { type: Number, default: Date.now() },
    quiz: [
        { question: String, correctAnswer: Number, options: [{ option: String }] }
    ],
    status: { type: String, default: 'published', enum: ['draft', 'published', 'deleted'] },
    Files: [String],
});
schema.virtual('id').get(function () {
    return this._id.toHexString();
});
schema.set('toJSON', {
    virtuals: true,
});
export const ChapterSchema = schema;

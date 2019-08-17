
import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    title: String,
    content: String,
    course: { type: Types.ObjectId, ref: 'course' },
    createDate: { type: Number, default: Date.now() },
});

export const ChallengeSchema = schema;

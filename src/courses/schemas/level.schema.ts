import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    title: String,
    courses: [{ type: Types.ObjectId, ref: 'comment' }],
    desc: String,
    status: String,
});

export const LevelSchema = schema;

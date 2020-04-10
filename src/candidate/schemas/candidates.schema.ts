import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    tel: String,
    image: String,
    createDate: { type: Number, default: Date.now },
});

export const CandidateSchema = schema;

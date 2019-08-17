import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    period: Number,
    type: { type: String },
    createDate: { type: Number, default: Date.now() },
    startedDate: { type: Number },
    finishDate: { type: Number },
    level: { type: Types.ObjectId, ref: 'level' },
    talents: [{ type: Types.ObjectId, ref: 'user' }],
    coachs: [{ type: Types.ObjectId, ref: 'user' }],
});

export const PoolSchema = schema;

import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    title: String,
    subTitle: String,
    desc: String,
    shortDesc: String,
    pic: String,
    promotion: {type: Number, default: 0},
    price: { type: Number, default: 0 },
    levels: [{ type: Types.ObjectId, ref: 'Level' }],
    status: { type: String, default: 'private', enum: ['draft', 'private', 'published', 'deleted', 'coming soon'] },
    duration: { type: Number, default: -1 },
    createDate: { type: Number, default: Date.now },
});

export const ModuleSchema = schema;

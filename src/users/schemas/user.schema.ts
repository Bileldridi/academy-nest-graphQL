import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: false, default: '' },
    recoveryToken: { type: String, required: false, default: '' },
    createDate: { type: Number, default: Date.now },
    lastLogin: { type: Number, default: 0 },
    tel: { type: String },
    note: { type: String },
    checkpoints: [{ idCourse: {type: Types.ObjectId, ref: 'Course'}, idChapters: [{type: Types.ObjectId, ref: 'Chapter'}],lastChapter:{type: Types.ObjectId, ref: 'Chapter'}, status:{type: String, default: 'started', enum: ['started', 'finished']} }],
    role: { type: String, default: 'candidate', enum: ['admin', 'coach', 'candidate'] },
    coach: { type: Types.ObjectId, ref: 'Coach' },
    candidate: { type: Types.ObjectId, ref: 'Candidate' },
    status: { type: String, default: 'active', enum: ['blocked', 'active', 'deleted'] },
});
schema.virtual('id').get(function () {
    return this._id.toHexString();
});
schema.set('toJSON', {
    virtuals: true,
});
export const UserSchema = schema;

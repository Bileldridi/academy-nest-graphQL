import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    role: String,
    lastLogin: String,
    status: String,
    onlineStatus: String,
    createDate: { type: Number, default: Date.now() },
});

export const UserSchema = schema;

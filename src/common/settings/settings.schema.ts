import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    code: String,
    user: { type: Types.ObjectId, ref: 'User' },
});
schema.virtual('id').get(function () {
    return this._id.toHexString();
});
schema.set('toJSON', {
    virtuals: true,
});
export const SettingsSchema = schema;
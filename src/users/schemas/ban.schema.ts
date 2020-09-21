import { Schema, Types } from 'mongoose';

export const schema: Schema = new Schema({
    banDate: { type: Number, default: Date.now },
    user: { type: Types.ObjectId, ref: 'User' },
    unBanned: {
        status: { type: Boolean, default: false },
        unbanDate: Number
    }
});
schema.virtual('id').get(function () {
    return this._id.toHexString();
});
schema.set('toJSON', {
    virtuals: true,
});
export const BanSchema = schema;
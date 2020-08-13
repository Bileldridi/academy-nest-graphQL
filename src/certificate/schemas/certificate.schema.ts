
import { Schema, Types } from 'mongoose'

export const schema: Schema = new Schema({
    user: { type: Types.ObjectId, ref: 'User' },
    code: { type: String },
    imgURL: { type: String },
    pathName: { type: String }
})

schema.virtual('id').get(function () {
    return this._id.toHexString();
});
schema.set('toJSON', {
    virtuals: true,
});
export const CertificateSchema = schema;

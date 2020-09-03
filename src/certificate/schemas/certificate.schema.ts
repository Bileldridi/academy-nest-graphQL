
import { Schema, Types } from 'mongoose'

export const schema: Schema = new Schema({
    candidate: { type: Types.ObjectId, ref: 'User' },
    code: { type: String },
    imgURL: { type: String }, 
    pathId: { type: Types.ObjectId, ref: 'Level' }
})

schema.virtual('id').get(function () {
    return this._id.toHexString();
});
schema.set('toJSON', {
    virtuals: true,
});
export const CertificateSchema = schema;

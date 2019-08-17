
import { Schema } from 'mongoose';

export const catSchema: Schema = new Schema({

    name: String,
    age: String,


});

export const CatSchema = catSchema;
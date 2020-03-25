import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CandidatesService {
    constructor(@InjectModel('User') private readonly userModel: Model<any>, @InjectModel('Candidate') private readonly candidateModel: Model<any>) { }

    async create(candidate) {
        console.log(candidate);
        const candidateResult = await this.candidateModel.create(candidate).catch(err => err);
        candidate['candidate'] = candidateResult._id;
        const userResult = await this.userModel.create(candidate).catch(err => err);
        return userResult; 
    }

    async update(candidate, _id) {
        const userResult = await this.userModel.findByIdAndUpdate({ _id }, candidate).catch(err => err);
        const candidateResult = await this.candidateModel.findByIdAndUpdate({ _id: userResult.candidate }, candidate).catch(err => err);
        const result = await this.userModel.findOne({ _id }).populate({ path: 'candidate' }).exec();
        return result;
    }
    async findAll() {
        console.log('heyy');

        const result = await this.userModel.find({ role: 'candidate' }).populate({ path: 'candidate' }).exec();
        console.log(result);

        return result;
    }
    async findOneById(id: string): Promise<any> {
        return await this.candidateModel.findById(id).exec();
    }
    async deleteOne(id: string): Promise<any> {
        console.log('deleted ', id);

        const result = await this.userModel.findByIdAndDelete(id).exec();
        console.log(result);

        return { id };
    }
    async deleteOnes(ids: string[]): Promise<any> {

        ids = ids[0].split(',').map(e => e.replace('\'', ''));
        console.log('deleted many', ids);
        for (const id of ids) {
            const result = await this.userModel.findByIdAndDelete(id).exec();
        }
        return { id: ids[0] };
    }
}

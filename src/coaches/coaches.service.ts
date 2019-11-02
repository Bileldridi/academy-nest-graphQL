import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CoachesService {

    constructor(@InjectModel('User') private readonly userModel: Model<any>, @InjectModel('Coach') private readonly coachModel: Model<any>) { }

    async create(coach) {
        console.log(coach);
        const coachResult = await this.coachModel.create(coach).catch(err => err);
        coach['coach'] = coachResult._id;
        const userResult = await this.userModel.create(coach).catch(err => err);
        return userResult;
    }

    async update(coach, _id) {
        const userResult = await this.userModel.findByIdAndUpdate({ _id }, coach).catch(err => err);
        const coachResult = await this.coachModel.findByIdAndUpdate({ _id: userResult.coach }, coach).catch(err => err);
        const result = await this.userModel.findOne({ _id }).populate({ path: 'coach' }).exec();
        return result;
    }
    async findAll() {
        console.log('heyy');

        const result = await this.userModel.find({ role: 'coach' }).populate({ path: 'coach' }).exec();
        return result;
    }
    async findOneById(id: string): Promise<any> {
        return await this.coachModel.findById(id).exec();
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

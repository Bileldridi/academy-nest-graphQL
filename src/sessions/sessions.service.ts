import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from 'src/graphql.schema';

@Injectable()
export class SessionsService {

  constructor(@InjectModel('Session') private readonly sessionModel: Model<any>,
    @InjectModel('User') private readonly userModel: Model<any>) { }

  async create(session: Session): Promise<Session> {
    return await this.sessionModel.create(session).catch(err => err)
  }

  async findAll(): Promise<Session[]> {
    return await this.sessionModel.find().exec();
  }

  async findOneById(id: string): Promise<Session> {
    return await this.sessionModel.findById(id).populate({ path: 'candidates', populate: { path: 'candidate' } }).populate({ path: 'coaches', populate: { path: 'coach' } }).exec();
  }

  async addCandidate(email: string, id: String): Promise<Session> {
    const candidate = await this.userModel.findOne({ email }).exec();
    if (candidate) {
      const result = await this.sessionModel.updateOne({ _id: id }, { $push: { candidates: candidate._id } }).exec()
      return await this.sessionModel.findById(id).exec();
    }
    return {}
  }
  async deleteCandidate(email: string, id: String): Promise<Session> {
    const candidate = await this.userModel.findOne({ email }).exec();
    if (candidate) {
      const result = await this.sessionModel.updateOne({ _id: id }, { $pull: { candidates: candidate._id } }).exec()
      return await this.sessionModel.findById(id).exec();
    }
    return {}
  }
  async addCoach(email: string, id: String): Promise<Session> {
    const coach = await this.userModel.findOne({ email }).exec();

    if (coach) {
      const result = await this.sessionModel.updateOne({ _id: id }, { $push: { coaches: coach._id } }).exec()
      console.log(email, id, coach, result)
      return await this.sessionModel.findById(id).exec();
    }
    return {}
  }
  async deleteCoach(email: string, id: String): Promise<Session> {
    const coach = await this.userModel.findOne({ email }).exec();
    if (coach) {
      const result = await this.sessionModel.updateOne({ _id: id }, { $pull: { coaches: coach._id } }).exec()
      return await this.sessionModel.findById(id).exec();
    }
    return {}
  }
  async update(session) {
    console.log(session);

    const result = await this.sessionModel.updateOne({ _id: session.id }, { $set: session }).exec()
    console.log(result);

    return await this.sessionModel.findById(session.id).exec();;
  }
  async deleteSession(id) {
    return await this.sessionModel.findOneAndRemove({ _id: id }).exec()
  }


}

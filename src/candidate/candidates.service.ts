import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto-js';
import * as nodemailer from 'nodemailer';
import * as smtpPool from 'nodemailer-smtp-pool';
import { sendEmailAccess } from '../common/mailer/mailer';

@Injectable()
export class CandidatesService {
	transporter;
	constructor(@InjectModel('User') private readonly userModel: Model<any>, @InjectModel('Candidate') private readonly candidateModel: Model<any>) { }

	async create(candidate) {
		console.log(candidate);
		const randomPass = Math.random().toString(36).slice(-8);
		console.log('randomPass', randomPass);
		const candidateResult = await this.candidateModel.create(candidate).catch(err => err);
		candidate['candidate'] = candidateResult._id;
		candidate['candidate'] = candidateResult._id;
		candidate['password'] = crypto.SHA256(randomPass).toString();
		const userResult = await this.userModel.create(candidate).catch(err => err);
		if (candidate.sendEmail) {
			await sendEmailAccess(candidate.email, randomPass)
		}
		return userResult;
	}

	async update(candidate, _id) {
		console.log(candidate);

		const userResult = await this.userModel.findOneAndUpdate({ _id }, candidate).catch(err => err);
		const candidateResult = await this.candidateModel.updateOne({ _id: userResult.candidate }, candidate).catch(err => err);
		console.log(candidateResult);
		const result = await this.userModel.findOne({ _id }).populate({ path: 'candidate' }).exec();
		return result;
	}
	async findAll() {
		const result = await this.userModel.find({ role: 'candidate' }).populate({ path: 'candidate' }).exec();
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

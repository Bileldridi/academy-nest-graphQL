import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CoursesService {
    private readonly logger = new Logger(CoursesService.name);
    constructor(
        @InjectModel('Session') private readonly sessionModel: Model<any>,
        @InjectModel('User') private readonly userModel: Model<any>,
        @InjectModel('Course') private readonly courseModel: Model<any>,
        @InjectModel('Level') private readonly levelModel: Model<any>,
        @InjectModel('Chapter') private readonly chapterModel: Model<any>,
        @InjectModel('Comment') private readonly commentModel: Model<any>,
        @InjectModel('Access') private readonly accessModel: Model<any>,
        @InjectModel('Progress') private readonly progressModel: Model<any>,
    ) { }
    @Cron(CronExpression.EVERY_30_MINUTES)
    async handleCron() {
        this.logger.debug('Called every 6 hours');

        const accesses = await this.accessModel.find({ status: 'active' });
        for (let i = 0; i < accesses.length; i++) {
            const e = accesses[i];
            const timeLeft = Math.round((((e.duration * 86400000) + (e.createDate)) - Date.now()) / 86400000);
            this.logger.debug('timeLeft ' + timeLeft);
            if (timeLeft < 0) {
                const result = await this.accessModel.updateOne({ _id: e._id }, { status: 'expired' }).exec();
                this.logger.debug('updated : ' + JSON.stringify(result));
            }
        }
    }

    // COURSE CRUDs
    async createCourse(session: any): Promise<any> {
        return await this.courseModel.create(session).catch(err => err);
    }
    async findAllCourses(): Promise<any[]> {
        const result = await this.courseModel.find().populate('levels').populate('chapters').exec();
        return result;
    }
    async getFeaturedCourses(): Promise<any[]> {
        const result = await this.courseModel.find({ status: 'published' }).populate('chapters').exec();
        return result.filter((e, i) => i < 6);
    }
    async getHomeCourses(): Promise<any[]> {
        const result = await this.courseModel.find({ status: 'published' }).populate('chapters').exec();
        return result;
    }
    async findOneCourseById(id: string): Promise<any> {
        return await this.courseModel.findById(id).populate('levels').populate('chapters').exec();
    }
    async deleteOneCourse(id: string): Promise<any> {
        await this.courseModel.findByIdAndDelete(id).exec();
        return { id };
    }
    async updateCourse(course, _id) {
        return await this.courseModel.findByIdAndUpdate({ _id }, course).catch(err => err);
    }
    // LEVEL CRUDs
    async createLevel(level: any): Promise<any> {
        return await this.levelModel.create(level).catch(err => err);
    }
    async findOneLevelById(id: string): Promise<any> {
        return await this.levelModel.findById(id).populate('courses').exec();
    }
    async findAllLevels(): Promise<any[]> {
        return await this.levelModel.find().populate('courses').exec();
    }
    async updateLevel(level, _id) {

        return await this.levelModel.findByIdAndUpdate({ _id }, level).catch(err => err);
    }
    async deleteOneLevel(id: string): Promise<any> {
        await this.levelModel.findByIdAndDelete(id).exec();
        return { id };
    }
    // CHAPTER CRUDs
    async createChapter(chapter: any): Promise<any> {
        const result = await this.chapterModel.create(chapter).catch(err => err);
        if (result.course) {
            await this.courseModel.findByIdAndUpdate(result.course, { $push: { chapters: result._id } }).exec();
        }
        return result;
    }
    async findOneChapterById(id: string): Promise<any> {
        return await this.chapterModel.findById(id).populate('course').exec();
    }
    async findAllChapters(): Promise<any[]> {
        return await this.chapterModel.find().populate('course').exec();
    }
    async updateChapter(chapter, _id) {
        if (chapter.course) {
            const oldCourse = await this.courseModel.updateOne({ chapters: _id }, { $pull: { chapters: _id } }).exec();

            const update = await this.courseModel.updateOne({ _id: chapter.course }, { $push: { chapters: chapter.id } }).exec();

        }
        return await this.chapterModel.findByIdAndUpdate({ _id }, chapter).populate('course').exec()
    }
    async deleteOneChapter(id: string): Promise<any> {
        await this.chapterModel.findByIdAndDelete(id).exec();
        return { id };
    }
    // COMMENTS CRUDs
    async createComment(comment: any): Promise<any> {
        return await this.commentModel.create(comment).catch(err => err);
    }
    async findOneCommentById(id: string): Promise<any> {
        return await this.commentModel.findById(id).exec();
    }
    async findAllComments(): Promise<any[]> {
        return await this.commentModel.find().exec();
    }
    async updateComment(comment, _id) {
        return await this.userModel.findByIdAndUpdate({ _id }, comment).catch(err => err);
    }
    async deleteOneComment(id: string): Promise<any> {
        await this.commentModel.findByIdAndDelete(id).exec();
        return { id };
    }
    // ACCESS CRUDs
    async createAccess(access: any): Promise<any> {
        return await this.accessModel.create(access).catch(err => err);
    }
    async findAccessByCourseId(id: string): Promise<any[]> {
        const result = await this.accessModel.find({ course: id }).populate('candidate').populate('course').populate('level')
            .then(data => {
                return data.map(e => ({ ...e._doc, id: e._doc._id, timeLeft: Math.round((((e.duration * 86400000) + (e.createDate)) - Date.now()) / 86400000) }));
            });
        return result;
    }
    async findAccessByLevelId(id: string): Promise<any[]> {
        const result = await this.accessModel.find({ level: id }).populate('candidate').populate('course').populate('level')
            .then(data => {
                return data.map(e => ({ ...e._doc, id: e._doc._id, timeLeft: Math.round((((e.duration * 86400000) + (e.createDate)) - Date.now()) / 86400000) }));
            });
        return result;
    }
    async findAccessByCandidateId(id: string): Promise<any[]> {
        const result = await this.accessModel.find({ candidate: id }).populate('candidate').populate('course').populate({ path: 'level', populate: { path: 'courses' } })
            .then(data => {
                return data.map(e => ({ ...e._doc, id: e._doc._id, timeLeft: Math.round((((e.duration * 86400000) + (e.createDate)) - Date.now()) / 86400000) }));
            });
        return result;
    }
    async findAllAccesss(): Promise<any[]> {
        return await this.accessModel.find().populate('candidate').populate('course').populate('level').exec();
    }
    async updateAccess(access, _id) {
        return await this.accessModel.findByIdAndUpdate({ _id }, access).catch(err => err);
    }
    async deleteOneAccess(id: string): Promise<any> {
        await this.accessModel.findByIdAndDelete(id).exec();
        return { id };
    }
    async updateProgress(progress, user) {
        progress.candidate = user.id;
        console.log(progress);

        const progressResult = await this.progressModel.findOne({ chapter: progress.chapter }).exec();
        if (progressResult) {
            progress.score += progressResult.score;
            return await this.progressModel.updateOne({ chapter: progress.chapter }, { $set: progress }).catch(err => err);
        }
        else {
            return await this.progressModel.create(progress).catch(err => err);
        }
    }


}

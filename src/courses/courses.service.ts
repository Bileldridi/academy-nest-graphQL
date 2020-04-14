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
        @InjectModel('Cemetery') private readonly cemeteryModel: Model<any>,
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
    async createCourse(course: any): Promise<any> {
        return await this.courseModel.create(course).catch(err => err);
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
    async deleteCourse(_id) {
        const result = await this.courseModel.findOne({ _id }).exec();
        this.cemeteryModel.create({ object: result, type: 'Course' }).catch(err => err);
        await this.courseModel.findByIdAndDelete(_id).exec();
        return result.id ? { message: 'OK' } : { message: 'NOT OK' }
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
    async getHomeLevels(): Promise<any[]> {
        return await this.levelModel.find({ status: 'published' }).populate('courses').exec();
    }
    async updateLevel(level, _id) {

        return await this.levelModel.findByIdAndUpdate({ _id }, level).catch(err => err);
    }
    async deleteLevel(_id) {
        const result = await this.levelModel.findOne({ _id }).exec();
        this.cemeteryModel.create({ object: result, type: 'Level' }).catch(err => err);
        await this.levelModel.findByIdAndDelete(_id).exec();
        return result.id ? { message: 'OK' } : { message: 'NOT OK' }
    }
    // CHAPTER CRUDs
    async createChapter(chapter: any): Promise<any> {
        console.log(chapter);

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
    async submitQuiz(quiz, userId) {
        console.log(quiz);
        const chapter = await this.chapterModel.findOne({ _id: quiz.id });
        console.log(chapter);
        const correctAnswers = chapter.quiz.map(q => q.correctAnswer);
        const score = (correctAnswers.filter((a, i) => quiz.answers[i] === a).length * 100) / correctAnswers.length;
        const progress = await this.progressModel.create({ candidate: userId, chapter: quiz.id, type: 'quiz', score }).catch(err => err);
        console.log(progress);
        return { message: score.toString() };
    }
    async checkQuiz(idQuiz, userId) {
        const chapter = await this.progressModel.findOne({ candidate: userId, chapter: idQuiz, type:'quiz' });
        console.log(chapter)
        return { message: chapter ? chapter.score : 'null' };
    }
    async deleteChapter(_id) {
        const result = await this.chapterModel.findOne({ _id }).exec();
        this.cemeteryModel.create({ object: result, type: 'Chapter' }).catch(err => err);
        await this.chapterModel.findByIdAndDelete(_id).exec();
        return result.id ? { message: 'OK' } : { message: 'NOT OK' }
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
    async deleteAccess(_id) {
        const result = await this.accessModel.findOne({ _id }).exec();
        this.cemeteryModel.create({ object: result, type: 'Access' }).catch(err => err);
        await this.accessModel.findByIdAndDelete(_id).exec();
        return result.id ? { message: 'OK' } : { message: 'NOT OK' };
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

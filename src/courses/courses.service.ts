import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ProgressSchema } from "./schemas/progress.schema";

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);
  constructor(
    @InjectModel("Session") private readonly sessionModel: Model<any>,
    @InjectModel("User") private readonly userModel: Model<any>,
    @InjectModel("Course") private readonly courseModel: Model<any>,
    @InjectModel("Level") private readonly levelModel: Model<any>,
    @InjectModel("Chapter") private readonly chapterModel: Model<any>,
    @InjectModel("Comment") private readonly commentModel: Model<any>,
    @InjectModel("Access") private readonly accessModel: Model<any>,
    @InjectModel("Progress") private readonly progressModel: Model<any>,
    @InjectModel("Cemetery") private readonly cemeteryModel: Model<any>,
    @InjectModel("Module") private readonly moduleModel: Model<any>
  ) {}
  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCron() {
    this.logger.debug("Called every 6 hours");

    const accesses = await this.accessModel.find({ status: "active" });
    for (let i = 0; i < accesses.length; i++) {
      const e = accesses[i];
      if (e.duration !== -1) {
        const timeLeft = Math.round(
          (e.duration * 86400000 + e.createDate - Date.now()) / 86400000
        );
        this.logger.debug("timeLeft " + timeLeft);
        if (timeLeft < 0) {
          const result = await this.accessModel
            .updateOne({ _id: e._id }, { status: "expired" })
            .exec();
          this.logger.debug("updated : " + JSON.stringify(result));
        }
      }
    }
  }

  // COURSE CRUDs
  async createCourse(course: any): Promise<any> {
    return await this.courseModel.create(course).catch((err) => err);
  }
  async findAllCourses(): Promise<any[]> {
    const result = await this.courseModel
      .find()
      .populate("levels")
      .populate("chapters")
      .exec();
    return result;
  }
  async getFeaturedCourses(): Promise<any[]> {
    const result = await this.courseModel
      .find({ status: "published" })
      .populate("chapters")
      .exec();
    return result.filter((e, i) => i < 6);
  }
  async getHomeCourses(): Promise<any[]> {
    const result = await this.courseModel
      .find({ $or: [{ status: "coming soon" }] })
      .populate("chapters")
      .exec();
    return result;
  }
  async findOneCourseById(id: string): Promise<any> {
    return await this.courseModel
      .findById(id)
      .populate("levels")
      .populate("chapters")
      .exec();
  }
  async deleteCourse(_id) {
    const result = await this.courseModel.findOne({ _id }).exec();
    this.cemeteryModel
      .create({ object: result, type: "Course" })
      .catch((err) => err);
    await this.courseModel.findByIdAndDelete(_id).exec();
    return result.id ? { message: "OK" } : { message: "NOT OK" };
  }
  async updateCourse(course, _id) {
    return await this.courseModel
      .findByIdAndUpdate({ _id }, course)
      .catch((err) => err);
  }
  // LEVEL CRUDs
  async createLevel(level: any): Promise<any> {
    return await this.levelModel.create(level).catch((err) => err);
  }
  async findOneLevelById(id: string): Promise<any> {
    return await this.levelModel.findById(id).populate("courses").exec();
  }
  async findAllLevels(): Promise<any[]> {
    return await this.levelModel.find().populate("courses").exec();
  }
  async getHomeLevels(): Promise<any[]> {
    return await this.levelModel
      .find({ $or: [{ status: "published" }, { status: "coming soon" }] })
      .populate("courses")
      .exec();
  }
  async updateLevel(level, _id) {
    return await this.levelModel
      .findByIdAndUpdate({ _id }, level)
      .catch((err) => err);
  }
  async deleteLevel(_id) {
    const result = await this.levelModel.findOne({ _id }).exec();
    this.cemeteryModel
      .create({ object: result, type: "Level" })
      .catch((err) => err);
    await this.levelModel.findByIdAndDelete(_id).exec();
    return result.id ? { message: "OK" } : { message: "NOT OK" };
  }
  // CHAPTER CRUDs
  async createChapter(chapter: any): Promise<any> {
    const result = await this.chapterModel.create(chapter).catch((err) => err);
    if (result.course) {
      await this.courseModel
        .findByIdAndUpdate(result.course, { $push: { chapters: result._id } })
        .exec();
    }
    return result;
  }
  async findOneChapterById(id: string): Promise<any> {
    return await this.chapterModel.findById(id).populate("course").exec();
  }
  async findAllChapters(): Promise<any[]> {
    return await this.chapterModel.find().populate("course").exec();
  }
  async updateChapter(chapter, _id) {
    if (chapter.course) {
      // const oldCourse = await this.courseModel.updateOne({ chapters: _id }, { $pull: { chapters: _id } }).exec();
      // const update = await this.courseModel.updateOne({ _id: chapter.course }, { $push: { chapters: chapter.id } }).exec();
    }
    return await this.chapterModel
      .findByIdAndUpdate({ _id }, chapter)
      .populate("course")
      .exec();
  }
  async submitQuiz(quiz, userId) {
    const chapter = await this.chapterModel.findOne({ _id: quiz.id });
    const correctAnswers = chapter.quiz.map((q) => q.correctAnswer);
    const score =
      (correctAnswers.filter((a, i) => quiz.answers[i] === a).length * 100) /
      correctAnswers.length;
    const existProgress = await this.progressModel.findOne({
      candidate: userId,
      chapter: quiz.id,
      type: "quiz",
    });
    if (existProgress) {
      const progress = await this.progressModel
        .findByIdAndUpdate(existProgress._id, { $set: { score } })
        .catch((err) => err);
    } else {
      const progress = await this.progressModel
        .create({ candidate: userId, chapter: quiz.id, type: "quiz", score })
        .catch((err) => err);
    }
    return { message: score.toString() };
  }
  async checkQuiz(idQuiz, userId) {
    const chapter = await this.progressModel.findOne({
      candidate: userId,
      chapter: idQuiz,
      type: "quiz",
    });
    return { message: chapter ? chapter.score : "null" };
  }
  async deleteChapter(_id) {
    const result = await this.chapterModel.findOne({ _id }).exec();
    this.cemeteryModel
      .create({ object: result, type: "Chapter" })
      .catch((err) => err);
    await this.courseModel.findByIdAndUpdate(result.course, {
      $pull: { chapters: result._id },
    });
    await this.chapterModel.findByIdAndDelete(_id).exec();
    return result.id ? { message: "OK" } : { message: "NOT OK" };
  }
  // COMMENTS CRUDs
  async createComment(comment: any): Promise<any> {
    return await this.commentModel.create(comment).catch((err) => err);
  }
  async findOneCommentById(id: string): Promise<any> {
    return await this.commentModel.findById(id).exec();
  }
  async findAllComments(): Promise<any[]> {
    return await this.commentModel.find().exec();
  }
  async updateComment(comment, _id) {
    return await this.userModel
      .findByIdAndUpdate({ _id }, comment)
      .catch((err) => err);
  }
  async deleteOneComment(id: string): Promise<any> {
    await this.commentModel.findByIdAndDelete(id).exec();
    return { id };
  }
  // ACCESS CRUDs
  async createAccess(access: any, user): Promise<any> {
    if (access.level) {
      const res = await this.updateProgressLevel(
        { idPath: access.level },
        user
      );
      // const existLevel = await this.progressModel.findOne({'path.idPath': access.level, candidate: user.id}).exec();
      // if(!existLevel) {
      //     const level = await this.levelModel.findById(access.level).exec();
      //     const object = {candidate: user.id, type: 'level', path: {idPath: access.level, actualCourse: level.courses[0] } }
      //     await this.progressModel.create(object).catch(err => err);
      // }
    } else if (access.module) {
      const res = await this.updateProgressModule(
        { idModule: access.module },
        user
      );
      // const existModule = await this.progressModel.findOne({'bootcamp.idModule': access.module, candidate: user.id}).exec();
      // if(!existModule) {
      //     const module = await this.moduleModel.findById(access.module).exec();
      //     const object = {candidate: user.id, type: 'module', bootcamp: {idModule: access.module, actualPath: module.levels[0] } }
      //     await this.progressModel.create(object).catch(err => err);
      // }
    }
    return await this.accessModel.create(access).catch((err) => err);
  }
  async findAccessByCourseId(id: string): Promise<any[]> {
    const result = await this.accessModel
      .find({ course: id })
      .populate("candidate")
      .populate("course")
      .populate("level")
      .then((data) => {
        return data.map((e) => ({
          ...e._doc,
          id: e._doc._id,
          timeLeft: Math.round(
            (e.duration * 86400000 + e.createDate - Date.now()) / 86400000
          ),
        }));
      });
    return result;
  }
  async findAccessByLevelId(id: string): Promise<any[]> {
    const result = await this.accessModel
      .find({ level: id })
      .populate("candidate")
      .populate("course")
      .populate("level")
      .then((data) => {
        return data.map((e) => ({
          ...e._doc,
          id: e._doc._id,
          timeLeft: Math.round(
            (e.duration * 86400000 + e.createDate - Date.now()) / 86400000
          ),
        }));
      });
    return result;
  }
  async findAccessByModuleId(id: string): Promise<any[]> {
    const result = await this.accessModel
      .find({ module: id })
      .populate("candidate")
      .populate("course")
      .populate("module")
      .then((data) => {
        return data.map((e) => ({
          ...e._doc,
          id: e._doc._id,
          timeLeft: Math.round(
            (e.duration * 86400000 + e.createDate - Date.now()) / 86400000
          ),
        }));
      });
    return result;
  }
  async findAccessByCandidateId(id: string): Promise<any[]> {
    const result = await this.accessModel
      .find({ candidate: id })
      .populate("candidate")
      .populate({ path: "course", populate: { path: "chapters" } })
      .populate({
        path: "level",
        populate: { path: "courses", populate: { path: "chapters" } },
      })
      .populate({
        path: "module",
        populate: {
          path: "levels",
          populate: { path: "courses", populate: { path: "chapters" } },
        },
      })
      .then((data) => {
        return data.map((e) => ({
          ...e._doc,
          id: e._doc._id,
          timeLeft: Math.round(
            (e.duration * 86400000 + e.createDate - Date.now()) / 86400000
          ),
        }));
      });
    return result;
  }
  async findAllAccesss(): Promise<any[]> {
    return await this.accessModel
      .find()
      .populate("candidate")
      .populate("course")
      .populate("level")
      .populate("module")
      .exec();
  }
  async updateAccess(access, _id) {
    return await this.accessModel
      .findByIdAndUpdate({ _id }, access)
      .catch((err) => err);
  }
  async deleteAccess(_id) {
    const result = await this.accessModel.findOne({ _id }).exec();
    this.cemeteryModel
      .create({ object: result, type: "Access" })
      .catch((err) => err);
    await this.accessModel.findByIdAndDelete(_id).exec();
    return result.id ? { message: "OK" } : { message: "NOT OK" };
  }
  // CRUD Progress
  async getPathProgress(user, pathId) {
    return await this.progressModel
      .findOne({ candidate: user.id, "path.idPath": pathId })
      .exec();
  }
  async updateProgress(progress, user) {
    progress.candidate = user.id;
    const progressResult = await this.progressModel
      .findOne({ chapter: progress.chapter })
      .exec();
    if (progressResult) {
      progress.score += progressResult.score;
      return await this.progressModel
        .updateOne({ chapter: progress.chapter }, { $set: progress })
        .catch((err) => err);
    } else {
      return await this.progressModel.create(progress).catch((err) => err);
    }
  }
  async updateProgressLevel(progress, user) {
    if (progress.idPath) {
      let totalAdvance = 0;
      const connectedUser = await this.userModel.findById(user.id).exec();
      const progressResult = await this.progressModel
        .findOne({ "path.idPath": progress.idPath, candidate: user.id })
        .exec();
      const actualPath = await this.levelModel
        .findById(progress.idPath)
        .populate("courses")
        .exec();
      actualPath.courses = actualPath.courses.map((obj) => {
        return obj._id;
      });
      connectedUser.checkpoints.map((course) => {
        if (actualPath.courses.includes(course.idCourse)) {
          if (course.progress) {
            totalAdvance = totalAdvance + course.progress;
          }
        }
      });
      if (progressResult) {
        await this.progressModel
          .updateOne(
            { "path.idPath": progress.idPath, candidate: user.id },
            {
              $set: {
                "path.advance": Math.round(
                  totalAdvance / actualPath.courses.length
                ),
              },
            }
          )
          .catch((err) => err);
      } else {
        const object = {
          candidate: user.id,
          type: "level",
          path: {
            idPath: progress.idPath,
            actualCourse: actualPath.courses[0]._id,
            advance: Math.round(totalAdvance / actualPath.courses.length),
          },
        };
        const res = await this.progressModel.create(object).catch((err) => err);
      }
    }
    const dup = await this.checkDuplicates(user);
    return null;
  }
  async updateProgressModule(progress, user) {
    if (progress && progress.idModule && progress.idModule !== "undefined") {
      const progressResult = await this.progressModel
        .findOne({ "bootcamp.idModule": progress.idModule, candidate: user.id })
        .exec();
      let totalAdvance = 0;
      const actualModule = await this.moduleModel
        .findById(progress.idModule)
        .populate("levels")
        .exec();
      actualModule.levels = actualModule.levels.map((obj) => {
        return obj._id;
      });
      actualModule.levels.map((obj) => {
        this.updateProgressLevel({ idPath: obj }, user);
      });
      const touchedLevels = await this.progressModel
        .find({ candidate: user.id, type: "level" })
        .exec();
      touchedLevels.map((level) => {
        if (actualModule.levels.includes(level.path.idPath)) {
          totalAdvance = totalAdvance + level.path.advance;
        }
      });
      if (progressResult) {
        await this.progressModel
          .updateOne(
            { "bootcamp.idModule": progress.idModule, candidate: user.id },
            {
              $set: {
                "bootcamp.advance": Math.round(
                  totalAdvance / actualModule.levels.length
                ),
              },
            }
          )
          .catch((err) => err);
      } else {
        const object = {
          candidate: user.id,
          type: "module",
          bootcamp: {
            idModule: progress.idModule,
            actualPath: actualModule.levels[0]._id,
            advance: Math.round(totalAdvance / actualModule.levels.length),
          },
        };
        const res = await this.progressModel.create(object).catch((err) => err);
      }
    }
    return null;
  }
  async refreshProgress(idCourse, user) {
    const listProgress = await this.progressModel
      .find({
        $or: [
          { candidate: user.id, type: "level" },
          { candidate: user.id, type: "module" },
        ],
      })
      .populate("candidate")
      .populate("path.idPath")
      .populate("bootcamp.idModule")
      .exec();
    listProgress.map(async (progress) => {
      if (progress.type === "level") {
        if (progress.path.idPath.courses.includes(idCourse)) {
          const res = await this.updateProgressLevel(
            { idPath: progress.path.idPath._id },
            user
          );
          listProgress
            .filter((obj) => obj.type === "module")
            .map(async (bootcamp) => {
              if (
                bootcamp.bootcamp.idModule.levels.includes(
                  progress.path.idPath._id
                )
              ) {
                const res2 = await this.updateProgressModule(
                  { idModule: bootcamp.bootcamp.idModule._id },
                  user
                );
              }
            });
        }
      }
    });
    return null;
  }
  async checkDuplicates(user) {
    let previousName = "";
    const liste = await this.progressModel
      .find({ candidate: user.id, type: "level" })
      .sort("path.idPath")
      .exec();
    liste.map(async (progress) => {
      const name = progress.path.idPath;
      console.log(previousName, name);
      if ("" + name === "" + previousName) {
        await this.progressModel
          .findByIdAndDelete({ _id: progress._id })
          .catch((err) => err);
      }
      previousName = name;
    });
  }
  async getAllProgress(user) {
    return await this.progressModel
      .find({ candidate: user.id })
      .populate("candidate")
      .exec();
  }
  // LEVEL MODULEs
  async createModule(module: any): Promise<any> {
    return await this.moduleModel.create(module).catch((err) => err);
  }
  async findOneModuleById(id: string): Promise<any> {
    return await this.moduleModel.findById(id).populate("levels").exec();
  }
  async findAllModules(): Promise<any[]> {
    return await this.moduleModel.find().populate("levels").exec();
  }
  async getHomeModules(): Promise<any[]> {
    return await this.moduleModel
      .find({ $or: [{ status: "published" }, { status: "coming soon" }] })
      .populate("levels")
      .exec();
  }
  async updateModule(module, _id) {
    return await this.moduleModel
      .findByIdAndUpdate({ _id }, module)
      .catch((err) => err);
  }
  async deleteModule(_id) {
    const result = await this.moduleModel.findOne({ _id }).exec();
    this.cemeteryModel
      .create({ object: result, type: "Module" })
      .catch((err) => err);
    await this.moduleModel.findByIdAndDelete(_id).exec();
    return result.id ? { message: "OK" } : { message: "NOT OK" };
  }
}

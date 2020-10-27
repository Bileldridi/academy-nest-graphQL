import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";

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

    // pull all deleted chapters from courses to get correct progress
    // one time use and the delete chapter methode will do the job
    const chapterCemetery = await this.cemeteryModel
      .find({ type: "Chapter" })
      .exec();
    chapterCemetery.forEach((chapter) => {
      this.courseModel
        .updateMany(
          { chapters: chapter.object._id },
          { $pull: { chapters: chapter.object._id } }
        )
        .exec();
    });
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
  async deleteChapter(_id) {
    const result = await this.chapterModel.findByIdAndUpdate(_id , {$set: {status: 'deleted'}}).exec();
    // await this.cemeteryModel.create({ object: result, type: "Chapter" }).catch((err) => err);
    // pull the chapter from course array and then delete it
    // await this.courseModel.findByIdAndUpdate(result.course, {
    //   $pull: { chapters: result._id },
    // });
    // await this.chapterModel.findByIdAndDelete(_id).exec();
    return result.id ? { message: "OK" } : { message: "NOT OK" };
  }
  async removeBootcamp(_id) {
    const result = await this.moduleModel.findByIdAndUpdate(_id , {$set: {status: 'deleted'}}).exec();
    return result.id ? { message: "OK" } : { message: "NOT OK" };
  }
  async removeCourse(_id) {
    const result = await this.courseModel.findByIdAndUpdate(_id , {$set: {status: 'deleted'}}).exec();
    return result.id ? { message: "OK" } : { message: "NOT OK" };
  }
  async removePath(_id) {
    const result = await this.levelModel.findByIdAndUpdate(_id , {$set: {status: 'deleted'}}).exec();
    return result.id ? { message: "OK" } : { message: "NOT OK" };
  }

  async restoreChapter(_id) {
    const result = await this.chapterModel.findByIdAndUpdate(_id , {$set: {status: 'published'}}).exec();
    return result.id ? { message: "OK" } : { message: "NOT OK" };
  }
  async restoreBootcamp(_id) {
    const result = await this.moduleModel.findByIdAndUpdate(_id , {$set: {status: 'published'}}).exec();
    return result.id ? { message: "OK" } : { message: "NOT OK" };
  }
  async restoreCourse(_id) {
    const result = await this.courseModel.findByIdAndUpdate(_id , {$set: {status: 'published'}}).exec();
    return result.id ? { message: "OK" } : { message: "NOT OK" };
  }
  async restorePath(_id) {
    const result = await this.levelModel.findByIdAndUpdate(_id , {$set: {status: 'published'}}).exec();
    return result.id ? { message: "OK" } : { message: "NOT OK" };
  }
  // CRUD Progress
  async getPathProgress(user, pathId) {
    return await this.progressModel
      .findOne({ candidate: user.id, path: pathId }).populate('path')
      .exec();
  }
    async findOneChapterById(id: string): Promise<any> {
        return await this.chapterModel.findById(id).populate('course').exec();
    }
    async findAllChapters(): Promise<any[]> {
        return await this.chapterModel.find().populate('course').exec();
    }


    async findCourses(obj) {
      const { scroll, searchValue } = obj
      let beginner = '';
      let intermediate = '';
      let expert = '';
      let deleted = '';
      let published = '';
      let comingSoon = '';
      let searchText;
      let init = 9;
      let skipped = 0
      let count = await this.courseModel.countDocuments()
      let courses = await this.courseModel.find().limit(init).populate('course').exec();
      searchValue[0].beginner ? beginner = 'beginner' : beginner = 'not' ;
      searchValue[0].intermediate ? intermediate = 'intermediate' : intermediate = 'not';
      searchValue[0].expert ? expert = 'expert' : expert = 'not';
      searchValue[0].deleted ? deleted = 'deleted' : deleted = 'not';
      searchValue[0].published ? published = 'published' : published = 'not';
      searchValue[0].comingSoon ? comingSoon = 'coming soon' : comingSoon = 'not';
      searchText = searchValue[0].searchTermCourses;

      if (searchText !== '' && beginner === 'not' && intermediate === 'not' && expert === 'not' && comingSoon === 'not' && deleted === 'not' && published === 'not') {
        courses = await this.courseModel.find({ title: { $regex: searchText, $options: 'i' } }).limit(init).populate('levels').populate("chapters").exec();
        count = await this.courseModel.find({ title: { $regex: searchText, $options: 'i' } }).countDocuments()
          skipped = 0
      }

      if (searchText === '' && (beginner !== 'not' || intermediate !== 'not' || expert !== 'not') && (deleted !== 'not' || published !== 'not' || comingSoon !== 'not')) {
        courses = await this.courseModel.find({
          $and: [
            { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }, { status: { $regex: comingSoon, $options: 'i' } }] },
            { $or: [{ type: { $regex: beginner, $options: 'i' } }, { type: { $regex: intermediate, $options: 'i' } }, { type: { $regex: expert, $options: 'i' } }] }
          ]
        }).limit(init).populate('levels').populate("chapters").exec();
        count = await this.courseModel.find({
          $and: [
            { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }, { status: { $regex: comingSoon, $options: 'i' } }] },
            { $or: [{ type: { $regex: beginner, $options: 'i' } }, { type: { $regex: intermediate, $options: 'i' } }, { type: { $regex: expert, $options: 'i' } }] }
          ]
        }).countDocuments()
          skipped = 0
      }

      if (searchText === '' && (beginner !== 'not' || intermediate !== 'not' || expert !== 'not') && (deleted === 'not' && published === 'not' && comingSoon === 'not')) {
        courses = await this.courseModel.find({
          $or: [
            { type: { $regex: beginner, $options: 'i' } }, { type: { $regex: intermediate, $options: 'i' } }, { type: { $regex: expert, $options: 'i' } }
          ]
        }).limit(init).populate('levels').populate("chapters").exec();
        count = await this.courseModel.find({
          $or: [
            { type: { $regex: beginner, $options: 'i' } }, { type: { $regex: intermediate, $options: 'i' } }, { type: { $regex: expert, $options: 'i' } }
          ]
        }).countDocuments()
          skipped = 0
      }

      if (searchText === '' && (beginner === 'not' && intermediate === 'not' && expert === 'not') && (deleted !== 'not' || published !== 'not' || comingSoon !== 'not')) {
        courses = await this.courseModel.find({
          $or: [
            { status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }, { status: { $regex: comingSoon, $options: 'i' } }
          ]
        }).limit(init).populate('levels').populate("chapters").exec();
        count = await this.courseModel.find({
          $or: [
            { status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }, { status: { $regex: comingSoon, $options: 'i' } }
          ]
        }).countDocuments()
          skipped = 0

      }

      if (searchText !== '' && (beginner === 'not' && intermediate === 'not' && expert === 'not') && (deleted !== 'not' || published !== 'not' || comingSoon !== 'not')) {
        courses = await this.courseModel.find({
          $and: [{ title: { $regex: searchText, $options: 'i' } },
          { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }] }, { status: { $regex: comingSoon, $options: 'i' } }
          ]
        }).limit(init).populate('levels').populate("chapters").exec();
        count = await this.courseModel.find({
          $and: [{ title: { $regex: searchText, $options: 'i' } },
          { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }] }, { status: { $regex: comingSoon, $options: 'i' } }
          ]
        }).countDocuments()
          skipped = 0


      }

      if (searchText !== '' && (beginner !== 'not' || intermediate !== 'not' || expert !== 'not') && (deleted === 'not' && published === 'not' && comingSoon === 'not')) {
        courses = await this.courseModel.find({
          $and: [
            { title: { $regex: searchText, $options: 'i' } },
            { $or: [{ type: { $regex: beginner, $options: 'i' } }, { type: { $regex: intermediate, $options: 'i' } }, { type: { $regex: expert, $options: 'i' } }] }
          ]
        }
        ).limit(init).populate('levels').populate("chapters").exec();
        count = await this.courseModel.find({
          $and: [
            { title: { $regex: searchText, $options: 'i' } },
            { $or: [{ type: { $regex: beginner, $options: 'i' } }, { type: { $regex: intermediate, $options: 'i' } }, { type: { $regex: expert, $options: 'i' } }] }
          ]
        }).countDocuments()
          skipped = 0
      }

      if (searchText !== '' && (beginner !== 'not' || intermediate !== 'not' || expert !== 'not') && (deleted !== 'not' || published !== 'not' || comingSoon !== 'not')) {
        courses = await this.courseModel.find({
          $and: [
            { title: { $regex: searchText, $options: 'i' } },
            {
              $and: [
                { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }, { status: { $regex: comingSoon, $options: 'i' } }] },
                { $or: [{ type: { $regex: beginner, $options: 'i' } }, { type: { $regex: intermediate, $options: 'i' } }, { type: { $regex: expert, $options: 'i' } }] }
              ]
            }
          ]
        }).limit(init).populate('levels').populate("chapters").exec();
          count = await this.courseModel.find({
            $and: [
              { title: { $regex: searchText, $options: 'i' } },
              {
                $and: [
                  { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }, { status: { $regex: comingSoon, $options: 'i' } }] },
                  { $or: [{ type: { $regex: beginner, $options: 'i' } }, { type: { $regex: intermediate, $options: 'i' } }, { type: { $regex: expert, $options: 'i' } }] }
                ]
              }
            ]
          }).countDocuments()
          skipped = 0
      }
      if (scroll > init) {
          courses = await this.courseModel.find().skip(scroll - 9).limit(init).populate('levels').populate("chapters").exec();

          if (searchText !== '' && beginner === 'not' && intermediate === 'not' && expert === 'not' && deleted === 'not' && published === 'not' && comingSoon === 'not') {
            courses = await this.courseModel.find({ title: { $regex: searchText, $options: 'i' } }).skip(scroll - 9).limit(init).populate('levels').populate("chapters").exec();
            count = await this.courseModel.find({ title: { $regex: searchText, $options: 'i' } }).countDocuments()
              
          }
    
          if (searchText === '' && (beginner !== 'not' || intermediate !== 'not' || expert !== 'not') && (deleted !== 'not' || published !== 'not' || comingSoon !== 'not')) {
            courses = await this.courseModel.find({
              $and: [
                { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }, { status: { $regex: comingSoon, $options: 'i' } }] },
                { $or: [{ type: { $regex: beginner, $options: 'i' } }, { type: { $regex: intermediate, $options: 'i' } }, { type: { $regex: expert, $options: 'i' } }] }
              ]
            }).skip(scroll - 9).limit(init).populate('levels').populate("chapters").exec();
            count = await this.courseModel.find({
              $and: [
                { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }, { status: { $regex: comingSoon, $options: 'i' } }] },
                { $or: [{ type: { $regex: beginner, $options: 'i' } }, { type: { $regex: intermediate, $options: 'i' } }, { type: { $regex: expert, $options: 'i' } }] }
              ]
            }).countDocuments()
              
          }
    
          if (searchText === '' && (beginner !== 'not' || intermediate !== 'not' || expert !== 'not') && (deleted === 'not' && published === 'not' && comingSoon === 'not')) {
            courses = await this.courseModel.find({
              $or: [
                { type: { $regex: beginner, $options: 'i' } }, { type: { $regex: intermediate, $options: 'i' } }, { type: { $regex: expert, $options: 'i' } }
              ]
            }).skip(scroll - 9).limit(init).populate('levels').populate("chapters").exec();
            count = await this.courseModel.find({
              $or: [
                { type: { $regex: beginner, $options: 'i' } }, { type: { $regex: intermediate, $options: 'i' } }, { type: { $regex: expert, $options: 'i' } }
              ]
            }).countDocuments()
              
          }
    
          if (searchText === '' && (beginner === 'not' && intermediate === 'not' && expert === 'not') && (deleted !== 'not' || published !== 'not' || comingSoon !== 'not')) {
            courses = await this.courseModel.find({
              $or: [
                { status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }, { status: { $regex: comingSoon, $options: 'i' } }
              ]
            }).skip(scroll - 9).limit(init).populate('levels').populate("chapters").exec();
            count = await this.courseModel.find({
              $or: [
                { status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }, { status: { $regex: comingSoon, $options: 'i' } }
              ]
            }).countDocuments()
              
    
          }
    
          if (searchText !== '' && (beginner === 'not' && intermediate === 'not' && expert === 'not') && (deleted !== 'not' || published !== 'not' || comingSoon !== 'not')) {
            courses = await this.courseModel.find({
              $and: [{ title: { $regex: searchText, $options: 'i' } },
              { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }, { status: { $regex: comingSoon, $options: 'i' } }] }
              ]
            }).skip(scroll - 9).limit(init).populate('levels').populate("chapters").exec();
            count = await this.courseModel.find({
              $and: [{ title: { $regex: searchText, $options: 'i' } },
              { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }, { status: { $regex: comingSoon, $options: 'i' } }] }
              ]
            }).countDocuments()
              
    
    
          }
    
          if (searchText !== '' && (beginner !== 'not' || intermediate !== 'not' || expert !== 'not') && (deleted === 'not' && published === 'not' && comingSoon === 'not')) {
            courses = await this.courseModel.find({
              $and: [
                { title: { $regex: searchText, $options: 'i' } },
                { $or: [{ type: { $regex: beginner, $options: 'i' } }, { type: { $regex: intermediate, $options: 'i' } }, { type: { $regex: expert, $options: 'i' } }] }
              ]
            }
            ).skip(scroll - 9).limit(init).populate('levels').populate("chapters").exec();
            count = await this.courseModel.find({
              $and: [
                { title: { $regex: searchText, $options: 'i' } },
                { $or: [{ type: { $regex: beginner, $options: 'i' } }, { type: { $regex: intermediate, $options: 'i' } }, { type: { $regex: expert, $options: 'i' } }] }
              ]
            }).countDocuments()
              
          }
    
          if (searchText !== '' && (beginner !== 'not' || intermediate !== 'not' || expert !== 'not') && (deleted !== 'not' || published !== 'not' || comingSoon !== 'not')) {
            courses = await this.courseModel.find({
              $and: [
                { title: { $regex: searchText, $options: 'i' } },
                {
                  $and: [
                    { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }, { status: { $regex: comingSoon, $options: 'i' } }] },
                    { $or: [{ type: { $regex: beginner, $options: 'i' } }, { type: { $regex: intermediate, $options: 'i' } }, { type: { $regex: expert, $options: 'i' } }] }
                  ]
                }
              ]
            }).skip(scroll - 9).limit(init).populate('levels').populate("chapters").exec();
              count = await this.courseModel.find({
                $and: [
                  { title: { $regex: searchText, $options: 'i' } },
                  {
                    $and: [
                      { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }, { status: { $regex: comingSoon, $options: 'i' } }] },
                      { $or: [{ type: { $regex: beginner, $options: 'i' } }, { type: { $regex: intermediate, $options: 'i' } }, { type: { $regex: expert, $options: 'i' } }] }
                    ]
                  }
                ]
              }).countDocuments()
              
          }
          skipped = scroll - 9
      }
      return { courses, count, skipped }

  }  

    async findChapters(obj) {
      const { scroll, searchValue } = obj
      let text = '';
      let quiz = '';
      let video = '';
      let deleted = '';
      let published = '';
      let searchText;
      let init = 9;
      let skipped = 0
      let count = await this.chapterModel.countDocuments()
      let chapters = await this.chapterModel.find().limit(init).populate('course').exec();
      searchValue[0].media ? text = 'text' : text = 'not' ;
      searchValue[0].quiz ? quiz = 'quiz' : quiz = 'not';
      searchValue[0].video ? video = 'video' : video = 'not';
      searchValue[0].deleted ? deleted = 'deleted' : deleted = 'not';
      searchValue[0].published ? published = 'published' : published = 'not';
      searchText = searchValue[0].searchTermChapters;

      if (searchText !== '' && text === 'not' && quiz === 'not' && video === 'not' && deleted === 'not' && published === 'not') {
        chapters = await this.chapterModel.find({ title: { $regex: searchValue[0].searchTermChapters, $options: 'i' } }).limit(init).populate('course').exec();
        count = await this.chapterModel.find({ title: { $regex: searchValue[0].searchTermChapters, $options: 'i' } }).countDocuments()
          skipped = 0
      }

      if (searchText === '' && (text !== 'not' || quiz !== 'not' || video !== 'not') && (deleted !== 'not' || published !== 'not')) {
        chapters = await this.chapterModel.find({
          $and: [
            { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }] },
            { $or: [{ type: { $regex: text, $options: 'i' } }, { type: { $regex: quiz, $options: 'i' } }, { type: { $regex: video, $options: 'i' } }] }
          ]
        }).limit(init).populate('course').exec();
        count = await this.chapterModel.find({
          $and: [
            { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }] },
            { $or: [{ type: { $regex: text, $options: 'i' } }, { type: { $regex: quiz, $options: 'i' } }, { type: { $regex: video, $options: 'i' } }] }
          ]
        }).countDocuments()
          skipped = 0
      }

      if (searchText === '' && (text !== 'not' || quiz !== 'not' || video !== 'not') && (deleted === 'not' && published === 'not')) {
        chapters = await this.chapterModel.find({
          $or: [
            { type: { $regex: text, $options: 'i' } }, { type: { $regex: quiz, $options: 'i' } }, { type: { $regex: video, $options: 'i' } }
          ]
        }).limit(init).populate('course').exec();
        count = await this.chapterModel.find({
          $or: [
            { type: { $regex: text, $options: 'i' } }, { type: { $regex: quiz, $options: 'i' } }, { type: { $regex: video, $options: 'i' } }
          ]
        }).countDocuments()
          skipped = 0
      }

      if (searchText === '' && (text === 'not' && quiz === 'not' && video === 'not') && (deleted !== 'not' || published !== 'not')) {
        chapters = await this.chapterModel.find({
          $or: [
            { status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }
          ]
        }).limit(init).populate('course').exec();
        count = await this.chapterModel.find({
          $or: [
            { status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }
          ]
        }).countDocuments()
          skipped = 0

      }

      if (searchText !== '' && (text === 'not' && quiz === 'not' && video === 'not') && (deleted !== 'not' || published !== 'not')) {
        chapters = await this.chapterModel.find({
          $and: [{ title: { $regex: searchValue[0].searchTermChapters, $options: 'i' } },
          { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }] }
          ]
        }).limit(init).populate('course').exec();
        count = await this.chapterModel.find({
          $and: [{ title: { $regex: searchValue[0].searchTermChapters, $options: 'i' } },
          { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }] }
          ]
        }).countDocuments()
          skipped = 0


      }

      if (searchText !== '' && (text !== 'not' || quiz !== 'not' || video !== 'not') && (deleted === 'not' && published === 'not')) {
        chapters = await this.chapterModel.find({
          $and: [
            { title: { $regex: searchValue[0].searchTermChapters, $options: 'i' } },
            { $or: [{ type: { $regex: text, $options: 'i' } }, { type: { $regex: quiz, $options: 'i' } }, { type: { $regex: video, $options: 'i' } }] }
          ]
        }
        ).limit(init).populate('course').exec();
        count = await this.chapterModel.find({
          $and: [
            { title: { $regex: searchValue[0].searchTermChapters, $options: 'i' } },
            { $or: [{ type: { $regex: text, $options: 'i' } }, { type: { $regex: quiz, $options: 'i' } }, { type: { $regex: video, $options: 'i' } }] }
          ]
        }).countDocuments()
          skipped = 0
      }

      if (searchText !== '' && (text !== 'not' || quiz !== 'not' || video !== 'not') && (deleted !== 'not' || published !== 'not')) {
        chapters = await this.chapterModel.find({
          $and: [
            { title: { $regex: searchValue[0].searchTermChapters, $options: 'i' } },
            {
              $and: [
                { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }] },
                { $or: [{ type: { $regex: text, $options: 'i' } }, { type: { $regex: quiz, $options: 'i' } }, { type: { $regex: video, $options: 'i' } }] }
              ]
            }
          ]
        }).limit(init).populate('course').exec();
          count = await this.chapterModel.find({
            $and: [
              { title: { $regex: searchValue[0].searchTermChapters, $options: 'i' } },
              {
                $and: [
                  { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }] },
                  { $or: [{ type: { $regex: text, $options: 'i' } }, { type: { $regex: quiz, $options: 'i' } }, { type: { $regex: video, $options: 'i' } }] }
                ]
              }
            ]
          }).countDocuments()
          skipped = 0
      }
      if (scroll > init) {
          chapters = await this.chapterModel.find().skip(scroll - 9).limit(init).populate('course').exec();

          if (searchText !== '' && text === 'not' && quiz === 'not' && video === 'not' && deleted === 'not' && published === 'not') {
            chapters = await this.chapterModel.find({ title: { $regex: searchValue[0].searchTermChapters, $options: 'i' } }).skip(scroll - 9).limit(init).populate('course').exec();
            count = await this.chapterModel.find({ title: { $regex: searchValue[0].searchTermChapters, $options: 'i' } }).countDocuments()
              
          }
    
          if (searchText === '' && (text !== 'not' || quiz !== 'not' || video !== 'not') && (deleted !== 'not' || published !== 'not')) {
            chapters = await this.chapterModel.find({
              $and: [
                { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }] },
                { $or: [{ type: { $regex: text, $options: 'i' } }, { type: { $regex: quiz, $options: 'i' } }, { type: { $regex: video, $options: 'i' } }] }
              ]
            }).skip(scroll - 9).limit(init).populate('course').exec();
            count = await this.chapterModel.find({
              $and: [
                { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }] },
                { $or: [{ type: { $regex: text, $options: 'i' } }, { type: { $regex: quiz, $options: 'i' } }, { type: { $regex: video, $options: 'i' } }] }
              ]
            }).countDocuments()
              
          }
    
          if (searchText === '' && (text !== 'not' || quiz !== 'not' || video !== 'not') && (deleted === 'not' && published === 'not')) {
            chapters = await this.chapterModel.find({
              $or: [
                { type: { $regex: text, $options: 'i' } }, { type: { $regex: quiz, $options: 'i' } }, { type: { $regex: video, $options: 'i' } }
              ]
            }).skip(scroll - 9).limit(init).populate('course').exec();
            count = await this.chapterModel.find({
              $or: [
                { type: { $regex: text, $options: 'i' } }, { type: { $regex: quiz, $options: 'i' } }, { type: { $regex: video, $options: 'i' } }
              ]
            }).countDocuments()
              
          }
    
          if (searchText === '' && (text === 'not' && quiz === 'not' && video === 'not') && (deleted !== 'not' || published !== 'not')) {
            chapters = await this.chapterModel.find({
              $or: [
                { status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }
              ]
            }).skip(scroll - 9).limit(init).populate('course').exec();
            count = await this.chapterModel.find({
              $or: [
                { status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }
              ]
            }).countDocuments()
              
    
          }
    
          if (searchText !== '' && (text === 'not' && quiz === 'not' && video === 'not') && (deleted !== 'not' || published !== 'not')) {
            chapters = await this.chapterModel.find({
              $and: [{ title: { $regex: searchValue[0].searchTermChapters, $options: 'i' } },
              { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }] }
              ]
            }).skip(scroll - 9).limit(init).populate('course').exec();
            count = await this.chapterModel.find({
              $and: [{ title: { $regex: searchValue[0].searchTermChapters, $options: 'i' } },
              { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }] }
              ]
            }).countDocuments()
              
    
    
          }
    
          if (searchText !== '' && (text !== 'not' || quiz !== 'not' || video !== 'not') && (deleted === 'not' && published === 'not')) {
            chapters = await this.chapterModel.find({
              $and: [
                { title: { $regex: searchValue[0].searchTermChapters, $options: 'i' } },
                { $or: [{ type: { $regex: text, $options: 'i' } }, { type: { $regex: quiz, $options: 'i' } }, { type: { $regex: video, $options: 'i' } }] }
              ]
            }
            ).skip(scroll - 9).limit(init).populate('course').exec();
            count = await this.chapterModel.find({
              $and: [
                { title: { $regex: searchValue[0].searchTermChapters, $options: 'i' } },
                { $or: [{ type: { $regex: text, $options: 'i' } }, { type: { $regex: quiz, $options: 'i' } }, { type: { $regex: video, $options: 'i' } }] }
              ]
            }).countDocuments()
              
          }
    
          if (searchText !== '' && (text !== 'not' || quiz !== 'not' || video !== 'not') && (deleted !== 'not' || published !== 'not')) {
            chapters = await this.chapterModel.find({
              $and: [
                { title: { $regex: searchValue[0].searchTermChapters, $options: 'i' } },
                {
                  $and: [
                    { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }] },
                    { $or: [{ type: { $regex: text, $options: 'i' } }, { type: { $regex: quiz, $options: 'i' } }, { type: { $regex: video, $options: 'i' } }] }
                  ]
                }
              ]
            }).skip(scroll - 9).limit(init).populate('course').exec();
              count = await this.chapterModel.find({
                $and: [
                  { title: { $regex: searchValue[0].searchTermChapters, $options: 'i' } },
                  {
                    $and: [
                      { $or: [{ status: { $regex: deleted, $options: 'i' } }, { status: { $regex: published, $options: 'i' } }] },
                      { $or: [{ type: { $regex: text, $options: 'i' } }, { type: { $regex: quiz, $options: 'i' } }, { type: { $regex: video, $options: 'i' } }] }
                    ]
                  }
                ]
              }).countDocuments()
              
          }
          skipped = scroll - 9
      }
      return { chapters, count, skipped }

  }
    async updateChapter(chapter, _id) {
        if (chapter.course) {
            // const oldCourse = await this.courseModel.updateOne({ chapters: _id }, { $pull: { chapters: _id } }).exec();
            // const update = await this.courseModel.updateOne({ _id: chapter.course }, { $push: { chapters: chapter.id } }).exec();
        }
        return await this.chapterModel.findByIdAndUpdate({ _id }, chapter).populate('course').exec()
    }
    async submitQuiz(quiz, userId) {
        const chapter = await this.chapterModel.findOne({ _id: quiz.id });
        const correctAnswers = chapter.quiz.map(q => q.correctAnswer);
        const score = (correctAnswers.filter((a, i) => quiz.answers[i] === a).length * 100) / correctAnswers.length;
        const existProgress = await this.progressModel.findOne({candidate: userId, chapter: quiz.id, type:'quiz'})
        if(existProgress) {
            const progress = await this.progressModel.findByIdAndUpdate(existProgress._id, {$set: {score}}).catch(err => err);
        } else {
            const progress = await this.progressModel.create({ candidate: userId, chapter: quiz.id, type: 'quiz', score }).catch(err => err);
        }
        return { message: score.toString() };
    }
    async removeQuizChapter(object, user) {
      const courseProgress = await this.progressModel.findOneAndUpdate({ candidate: user.id, 'course.id': object.idCourse}, {$pull: {'course.checkedChapters': object.idChapter}}, {new: true} ).catch(err => err);
      const course = await this.courseModel.findById(object.idCourse).exec();
    const averageProgress = Math.round((courseProgress.course.checkedChapters.length * 100) / course.chapters.length);
    const res = await this.progressModel.findByIdAndUpdate(courseProgress._id, { $set: { progress: averageProgress} }, {new: true}).populate('candidate').populate('path').populate('bootcamp').catch(err => err);
    return res;
    }
    async checkQuiz(idQuiz, userId) {
        const chapter = await this.progressModel.findOne({ candidate: userId, chapter: idQuiz, type:'quiz' });
        return { message: chapter ? chapter.score : 'null' };
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
    async createAccess(access: any, user): Promise<any> {
        if(access.course) {
          const course = await this.courseModel.findById(access.course).exec();
            const exists = await this.progressModel.findOne({candidate: access.candidate, 'course.id': access.course}).exec();
            if(!exists) {
                const objectProgress = {candidate: access.candidate,type: 'course', course: {id: access.course, lastChapter: course.chapters[0], checkedChapters: []}};
                await this.progressModel.create(objectProgress).catch(err => err);
            }
        } else if(access.level) {
            const exists = await this.progressModel.findOne({candidate: access.candidate, path: access.level}).exec();
            if(!exists) {
                const objectProgress = {candidate: access.candidate,type: 'level', path: access.level};
                await this.progressModel.create(objectProgress).catch(err => err);
                this.checkCourseInPath(access.level, access.candidate);
            }
        } else {
            const exists = await this.progressModel.findOne({candidate: access.candidate, bootcamp: access.module}).exec();
            if(!exists) {
            const objectProgress = {candidate: access.candidate, type: 'module', bootcamp: access.module};
            await this.progressModel.create(objectProgress).catch(err => err);
            this.checkPathInBootcamp(access.module, access.candidate);
            }
        }
        return await this.accessModel.create(access).catch(err => err);
    }
    async checkCourseInPath(level, user) {
        const path = await this.levelModel.findById(level).populate('courses').exec();
        path.courses.map(async course => {
            const alreadyExist = await this.progressModel.findOne({candidate: user,'course.id': course._id}).exec();
            if(!alreadyExist) {
            const objectProgress = {candidate: user,type: 'course', course: {id: course._id, lastChapter: course.chapters[0], checkedChapters: []}};
            await this.progressModel.create(objectProgress).catch(err => err);
            }
        });
    }
    async checkPathInBootcamp(module, user) {
        const bootcamp = await this.moduleModel.findById(module).populate('levels').exec();
        bootcamp.levels.map(async level => {
            const alreadyExist = await this.progressModel.findOne({candidate: user, path: level._id}).exec();
            if(!alreadyExist) {
                const objectProgress = {candidate: user,type: 'level', path: level._id};
                await this.progressModel.create(objectProgress).catch(err => err);
                this.checkCourseInPath(level._id, user);
            }
        });
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
    async findAccessByModuleId(id: string): Promise<any[]> {
        const result = await this.accessModel.find({ module: id }).populate('candidate').populate('course').populate('module')
            .then(data => {
                return data.map(e => ({ ...e._doc, id: e._doc._id, timeLeft: Math.round((((e.duration * 86400000) + (e.createDate)) - Date.now()) / 86400000) }));
            });
        return result;
    }
    async findAccessByCandidateId(id: string): Promise<any[]> {
        const result = await this.accessModel.find({ candidate: id }).populate('candidate').populate({path: 'course', populate : {path: 'chapters'}}).populate({ path: 'level', populate: { path: 'courses', populate : {path: 'chapters'} } }).populate({ path: 'module', populate: { path: 'levels', populate: {path: 'courses', populate : {path: 'chapters'}}  } })
            .then(data => {
                return data.map(e => ({ ...e._doc, id: e._doc._id, timeLeft: Math.round((((e.duration * 86400000) + (e.createDate)) - Date.now()) / 86400000) }));
            });
        return result;
    }
    async findAllAccesss(): Promise<any[]> {
        return await this.accessModel.find().populate('candidate').populate('course').populate('level').populate('module').exec();
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
    
    // LEVEL MODULEs
    async createModule(module: any): Promise<any> {
        return await this.moduleModel.create(module).catch(err => err);
    }
    async findOneModuleById(id: string): Promise<any> {
        return await this.moduleModel.findById(id).populate('levels').exec();
    }
    async findAllModules(): Promise<any[]> {
        return await this.moduleModel.find().populate('levels').exec();
    }
    async getHomeModules(): Promise<any[]> {
        return await this.moduleModel.find({$or:[{status: 'published'}, {status: 'coming soon' }]}).populate('levels').exec();
    }
    async updateModule(module, _id) {

        return await this.moduleModel.findByIdAndUpdate({ _id }, module).catch(err => err);
    }
    async deleteModule(_id) {
        const result = await this.moduleModel.findOne({ _id }).exec();
        this.cemeteryModel.create({ object: result, type: 'Module' }).catch(err => err);
        await this.moduleModel.findByIdAndDelete(_id).exec();
        return result.id ? { message: 'OK' } : { message: 'NOT OK' }
    }
// CRUD Progress
async getAllAdvancements(user) {
    return await this.progressModel.find({candidate: user.id}).populate('candidate').populate('path').populate('bootcamp').exec();
} 
async updateProgress(progress, user) {
    progress.candidate = user.id;
    const progressResult = await this.progressModel.findOne({ chapter: progress.chapter }).exec();
    if (progressResult) {
        progress.score += progressResult.score;
        return await this.progressModel.updateOne({ chapter: progress.chapter }, { $set: progress }).catch(err => err);
    }
    else {
        return await this.progressModel.create(progress).catch(err => err);
    }
}
async getCurrentProgress(idCourse, user) {
    return await this.progressModel.findOne({'course.id': idCourse, candidate: user.id}).populate('candidate').populate('path').populate('bootcamp').exec();
}
async updateAdvancement(advance, user) {
    const globalCourse = await this.courseModel.findById(advance.id).exec();
    const progressCourse = await this.progressModel.findOne({ 'course.id': advance.id, candidate: user.id }).exec();
    if(!progressCourse.course.checkedChapters.includes(advance.lastChapter)) {
        progressCourse.course.checkedChapters.push(advance.lastChapter);
        advance.checkedChapters = progressCourse.course.checkedChapters;
    } else {
        advance.checkedChapters = progressCourse.course.checkedChapters;
    }
    const updatedProgress = await this.progressModel.findOneAndUpdate({ 'course.id': advance.id, candidate: user.id }, { $set: { course: advance}}, {new: true, upsert: false}).catch(err => err);
    const averageProgress = Math.round((updatedProgress.course.checkedChapters.length * 100) / globalCourse.chapters.length);
    const res = await this.progressModel.findByIdAndUpdate(progressCourse._id, { $set: { progress: averageProgress} }, {new: true}).populate('candidate').populate('path').populate('bootcamp').catch(err => err);
    return res;
}
async updateAdvancementPath(idPath, user) {
    let progress = 0;
    const progressPath = await this.progressModel.findOne({path: idPath, candidate: user.id}).populate('path').exec();
    const coursesPath = await this.progressModel.find({type: 'course', candidate: user.id}).exec();
    if(progressPath) {
        coursesPath.map(course => {
            if(progressPath.path.courses.includes(course.course.id)) {
                progress += course.progress;
            } 
        });
        
        const averageProgress = Math.round(progress / progressPath.path.courses.length);
        const updatedProgress = await this.progressModel.findOneAndUpdate({ 'path': idPath, candidate: user.id }, { $set: { progress: averageProgress}}, {new: true, upsert: false}).populate('candidate').populate('path').populate('bootcamp').catch(err => err);
        return updatedProgress;
    }
    return null;
}
async updateAdvancementModule(idBootcamp, user) {
    let progress = 0;
    const progressBootcamp = await this.progressModel.findOne({bootcamp: idBootcamp, candidate: user.id}).populate('bootcamp').exec();
    const PathsBootcamp = await this.progressModel.find({type: 'level', candidate: user.id}).exec();
    PathsBootcamp.map(path => {
        if(progressBootcamp.bootcamp.levels.includes(path.path)) {
            progress += path.progress;
        } 
    });
    
    const averageProgress = Math.round(progress / progressBootcamp.bootcamp.levels.length);
    const updatedProgress = await this.progressModel.findOneAndUpdate({ bootcamp: idBootcamp, candidate: user.id }, { $set: { progress: averageProgress}}, {new: true, upsert: false}).populate('candidate').populate('path').populate('bootcamp').catch(err => err);
    return updatedProgress;
}
async updateAllCoursesAdvancements(user) {
    const allProgress = await this.progressModel.find({candidate: user.id, type: 'course'}).exec();
    allProgress.map(async progress => {
      if(!progress.chapter) {
        const res = await this.updateAdvancement(progress.course, user);
      }    
    });
    return null;
}
async updateAllPathsAdvancements(user) {
    const allProgress = await this.progressModel.find({candidate: user.id, type: 'level'}).exec();
    allProgress.map(async progress => {
            const res = await this.updateAdvancementPath(progress.path, user);
    });
    return null;
}
async updateAllBootcampsAdvancements(user) {
    const allProgress = await this.progressModel.find({candidate: user.id, type: 'module'}).exec();
    allProgress.map(async progress => {
            const res = await this.updateAdvancementModule(progress.bootcamp, user);
    });
    return null;
}
async updateFinishedCourse(id) {
    return await this.progressModel.findByIdAndUpdate(id, {$set: {finished: true}}, {new: true}).catch(err => err);
}
async updateFinishedPath(id) {
  return await this.progressModel.findByIdAndUpdate(id, {$set: {finished: true}}, {new: true}).catch(err => err);
}
async migrateData() {
  await this.progressModel.deleteMany().catch(err => err);
  await this.accessModel.deleteMany().catch(err => err);
  await this.userModel.updateMany({}, { checkpoints: [] }).catch(err => err);
  // const allUsers = await this.userModel.find().exec();
  // allUsers.map(async user => {
  //   const allAccess = await this.accessModel.find({candidate: user._id}).exec();
  //   allAccess.map(async access => {
  //   if(user['checkpoints'] && access.course) {
  //     const index = user['checkpoints'].findIndex(obj => ''+obj.idCourse === ''+access.course);
  //      (index !== -1) ? access['existCourse'] = {id: access.course, lastChapter: user['checkpoints'][index].lastChapter, checkedChapters: user['checkpoints'][index].idChapters,progress: user['checkpoints'][index].progress}: null;
  //   }
  //     await this.createAccess(access, user);
  //   })
  // });
  return null;
}
}

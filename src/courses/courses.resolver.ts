import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from '../common/guards/gql.auth.guard';
import { User } from '../common/decorators/current-user.decorator';

@Resolver('Courses')
export class CoursesResolver {

    constructor(private readonly coursesService: CoursesService) { }

    // COURSE CRUDs
    @Query()
    async getCourses() {
        return await this.coursesService.findAllCourses();
    }
    @Query('getFeaturedCourses')
    async getFeaturedCourses() {
        return await this.coursesService.getFeaturedCourses();
    }
    @Query('getHomeCourses')
    async getHomeCourses() {
        return await this.coursesService.getHomeCourses();
    }

    @Query('Course')
    async findOneCourseById(@Args('id') id: string): Promise<any> {
        return await this.coursesService.findOneCourseById(id);
    }
    @Query('removeCourse')
    async deleteOneCourse(@Args('id') id: string): Promise<any> {
        return await this.coursesService.deleteOneCourse(id);
    }
    @Mutation('createCourse')
    async createCourse(@Args('createCourseInput') args: any): Promise<any> {
        return await this.coursesService.createCourse(args);
    }
    @Mutation('updateCourse')
    async updateCourse(@Args('updateCourseInput') args: any): Promise<any> {
        return await this.coursesService.updateCourse(args, args.id);
    }
    // LEVEL CRUDs
    @Query()
    async getLevels() {
        return await this.coursesService.findAllLevels();
    }
    @Query('Level')
    async findOneLevelById(@Args('id') id: string): Promise<any> {
        return await this.coursesService.findOneLevelById(id);
    }
    @Query('removeLevel')
    async deleteOneLevel(@Args('id') id: string): Promise<any> {
        return await this.coursesService.deleteOneLevel(id);
    }
    @Mutation('createLevel')
    async createLevel(@Args('createLevelInput') args: any): Promise<any> {
        return await this.coursesService.createLevel(args);
    }
    @Mutation('updateLevel')
    async updateLevel(@Args('updateLevelInput') args: any): Promise<any> {
        return await this.coursesService.updateLevel(args, args.id);
    }
    // CHAPTERS CRUDs
    @UseGuards(GraphqlAuthGuard)
    @Query()
    async getChapters() {
        return await this.coursesService.findAllChapters();
    }
    @Query('Chapter')
    async findOneChapterById(@Args('id') id: string): Promise<any> {
        return await this.coursesService.findOneChapterById(id);
    }
    @Query('removeChapter')
    async deleteOneChapter(@Args('id') id: string): Promise<any> {
        return await this.coursesService.deleteOneChapter(id);
    }
    @Mutation('createChapter')
    async createChapter(@Args('createChapterInput') args: any): Promise<any> {
        return await this.coursesService.createChapter(args);
    }
    @Mutation('updateChapter')
    async updateChapter(@Args('updateChapterInput') args: any): Promise<any> {
        return await this.coursesService.updateChapter(args, args.id);
    }
    // COMMENTS CRUDs
    @Query()
    async getComments() {
        return await this.coursesService.findAllComments();
    }
    @Query('Comment')
    async findOneCommentById(@Args('id') id: string): Promise<any> {
        return await this.coursesService.findOneCommentById(id);
    }
    @Query('removeComment')
    async deleteOneComment(@Args('id') id: string): Promise<any> {
        return await this.coursesService.deleteOneComment(id);
    }
    @Mutation('createComment')
    async createComment(@Args('createCommentInput') args: any): Promise<any> {
        return await this.coursesService.createComment(args);
    }
    @Mutation('updateComment')
    async updateComment(@Args('updateCommentInput') args: any): Promise<any> {
        return await this.coursesService.updateComment(args, args.id);
    }
    // ACCESS
    @Query()
    async getAccesss() {
        return await this.coursesService.findAllAccesss();
    }
    @Query('Access')
    async findAccessByCourseId(@Args('id') id: string): Promise<any[]> {
        return await this.coursesService.findAccessByCourseId(id);
    }
    @Query('LevelAccess')
    async findAccessByLevelId(@Args('id') id: string): Promise<any[]> {
        return await this.coursesService.findAccessByLevelId(id);
    }
    @UseGuards(GraphqlAuthGuard)
    @Query('getCandidateAccess')
    async findAccessByCandidateId(@Args('id') id: string, @User() user): Promise<any[]> {
        return await this.coursesService.findAccessByCandidateId(user.id);
    }
    @Query('removeAccess')
    async deleteOneAccess(@Args('id') id: string): Promise<any> {
        return await this.coursesService.deleteOneAccess(id);
    }
    @Mutation('createAccess')
    async createAccess(@Args('createAccessInput') args: any): Promise<any> {
        return await this.coursesService.createAccess(args);
    }
    @Mutation('updateAccess')
    async updateAccess(@Args('updateAccessInput') args: any): Promise<any> {
        return await this.coursesService.updateAccess(args, args.id);
    }
    // PROGRESS
    @UseGuards(GraphqlAuthGuard)
    @Mutation('updateProgress')
    async updateProgress(@Args('updateProgressInput') args: any, @User() user): Promise<any> {
        return await this.coursesService.updateProgress(args, user);
    }

}

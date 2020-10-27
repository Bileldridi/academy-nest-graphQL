import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { UseGuards, SetMetadata } from '@nestjs/common';
import { GraphqlAuthGuard } from '../common/guards/gql.auth.guard';
import { User } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

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
        return await this.coursesService.deleteCourse(id);
    }
    @SetMetadata('roles', ['admin'])
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Mutation('createCourse')
    async createCourse(@Args('createCourseInput') args: any): Promise<any> {
        return await this.coursesService.createCourse(args);
    }
    @SetMetadata('roles', ['admin'])
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Mutation('updateCourse')
    async updateCourse(@Args('updateCourseInput') args: any): Promise<any> {
        return await this.coursesService.updateCourse(args, args.id);
    }
    // LEVEL CRUDs
    @SetMetadata('roles', ['admin'])
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Query()
    async getLevels() {
        return await this.coursesService.findAllLevels();
    }
    @Query('getHomeLevels')
    async getHomeLevels() {
        return await this.coursesService.getHomeLevels();
    }
    @Query('Level')
    async findOneLevelById(@Args('id') id: string): Promise<any> {
        return await this.coursesService.findOneLevelById(id);
    }
    @SetMetadata('roles', ['admin'])
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Query('removeLevel')
    async deleteOneLevel(@Args('id') id: string): Promise<any> {
        return await this.coursesService.deleteLevel(id);
    }
    @SetMetadata('roles', ['admin'])
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Mutation('createLevel')
    async createLevel(@Args('createLevelInput') args: any): Promise<any> {
        return await this.coursesService.createLevel(args);
    }
    @SetMetadata('roles', ['admin'])
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Mutation('updateLevel')
    async updateLevel(@Args('updateLevelInput') args: any): Promise<any> {
        return await this.coursesService.updateLevel(args, args.id);
    }
    // CHAPTERS CRUDs

    @Roles('admin')

    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Query()
    async getChapters() {
        return await this.coursesService.findAllChapters();
    }

    @SetMetadata('roles', ['admin'])
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Query('scrollChapters')
    async scrollChapters(@Args('scroll') scroll): Promise<any> {
        return await this.coursesService.findChapters(scroll);
    }

    @SetMetadata('roles', ['admin'])
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Query('scrollCourses')
    async scrollCourses(@Args('scroll') scroll): Promise<any> {
        return await this.coursesService.findCourses(scroll);
    }

    @Roles('admin')
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Query('Chapter')
    async findOneChapterById(@Args('id') id: string): Promise<any> {
        return await this.coursesService.findOneChapterById(id);
    }
    @Roles('admin')
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Query('removeChapter')
    async deleteOneChapter(@Args('id') id: string): Promise<any> {
        return await this.coursesService.deleteChapter(id);
    }
    @Roles('admin')
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Query('removeBootcamp')
    async removeBootcamp(@Args('id') id: string): Promise<any> {
        return await this.coursesService.removeBootcamp(id);
    }
    @Roles('admin')
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Query('removePath')
    async removePath(@Args('id') id: string): Promise<any> {
        return await this.coursesService.removePath(id);
    }
    @Roles('admin')
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Query('removeCourse')
    async removeCourse(@Args('id') id: string): Promise<any> {
        return await this.coursesService.removeCourse(id);
    }
    @Roles('admin')
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Query('restoreChapter')
    async restoreChapter(@Args('id') id: string): Promise<any> {
        return await this.coursesService.restoreChapter(id);
    }
    @Roles('admin')
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Query('restoreBootcamp')
    async restoreBootcamp(@Args('id') id: string): Promise<any> {
        return await this.coursesService.restoreBootcamp(id);
    }
    @Roles('admin')
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Query('restorePath')
    async restorePath(@Args('id') id: string): Promise<any> {
        return await this.coursesService.restorePath(id);
    }
    @Roles('admin')
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Query('restoreCourse')
    async restoreCourse(@Args('id') id: string): Promise<any> {
        return await this.coursesService.restoreCourse(id);
    }
    @UseGuards(GraphqlAuthGuard)
    @Query('checkQuiz')
    async checkQuiz(@Args('id') id: string, @User() user): Promise<any> {
        return await this.coursesService.checkQuiz(id, user.id);
    }
    @Roles('admin')
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Mutation('createChapter')
    async createChapter(@Args('createChapterInput') args: any): Promise<any> {
        return await this.coursesService.createChapter(args);
    }
    @Roles('admin')
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Mutation('updateChapter')
    async updateChapter(@Args('updateChapterInput') args: any): Promise<any> {
        return await this.coursesService.updateChapter(args, args.id);
    }
    @UseGuards(GraphqlAuthGuard)
    @Mutation('submitQuiz')
    async submitQuiz(@Args('quizAnswerInput') args: any, @User() user): Promise<any> {
        return await this.coursesService.submitQuiz(args, user.id);
    }
    @UseGuards(GraphqlAuthGuard)
    @Mutation('removeQuizChapter')
    async removeQuizChapter(@Args('removeQuizInput') args: any, @User() user): Promise<any> {
        return await this.coursesService.removeQuizChapter(args, user);
    }
    @UseGuards(GraphqlAuthGuard)
    @Mutation('updateFinishedCourse')
    async updateFinishedCourse(@Args('id') id: String): Promise<any> {
        return await this.coursesService.updateFinishedCourse(id);
    }
    @UseGuards(GraphqlAuthGuard)
    @Mutation('updateFinishedPath')
    async updateFinishedPath(@Args('id') id: String): Promise<any> {
        return await this.coursesService.updateFinishedPath(id);
    }
    // COMMENTS CRUDs
    @Roles('admin')
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Query()
    async getComments() {
        return await this.coursesService.findAllComments();
    }
    @Roles('admin')

    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Query('Comment')
    async findOneCommentById(@Args('id') id: string): Promise<any> {
        return await this.coursesService.findOneCommentById(id);
    }
    @Roles('admin')

    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Query('removeComment')
    async deleteOneComment(@Args('id') id: string): Promise<any> {
        return await this.coursesService.deleteOneComment(id);
    }
    @Roles('admin')

    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Mutation('createComment')
    async createComment(@Args('createCommentInput') args: any): Promise<any> {
        return await this.coursesService.createComment(args);
    }
    @Roles('admin')
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Mutation('updateComment')
    async updateComment(@Args('updateCommentInput') args: any): Promise<any> {
        return await this.coursesService.updateComment(args, args.id);
    }
    // ACCESS
    @Roles('admin')

    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Query()
    async getAccesss() {
        return await this.coursesService.findAllAccesss();
    }
    @Roles('admin')

    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Query('Access')
    async findAccessByCourseId(@Args('id') id: string): Promise<any[]> {
        return await this.coursesService.findAccessByCourseId(id);
    }
    @Roles('admin')
    @Query('LevelAccess')
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    async findAccessByLevelId(@Args('id') id: string): Promise<any[]> {
        return await this.coursesService.findAccessByLevelId(id);
    }

    @Roles('admin')
    @Query('ModuleAccess')
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    async findAccessByModuleId(@Args('id') id: string): Promise<any[]> {
        return await this.coursesService.findAccessByModuleId(id);
    }
    @Roles('admin')
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Query('getCandidateAccess')
    async findAccessByCandidateId(@Args('id') id: string, @User() user): Promise<any[]> {
        return await this.coursesService.findAccessByCandidateId(id);
    }
    @UseGuards(GraphqlAuthGuard)
    @Query('getCurrentCandidateAccess')
    async getCurrentCandidateAccess(@Args('id') id: string, @User() user): Promise<any[]> {
        return await this.coursesService.findAccessByCandidateId(user.id);
    }
    @Roles('admin')
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Query('removeAccess')
    async deleteOneAccess(@Args('id') id: string): Promise<any> {
        return await this.coursesService.deleteAccess(id);
    }
    @Roles('admin')
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Mutation('createAccess')
    async createAccess(@Args('createAccessInput') args: any, @User() user): Promise<any> {
        return await this.coursesService.createAccess(args, user);
    }
    @Roles('admin')
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Mutation('updateAccess')
    async updateAccess(@Args('updateAccessInput') args: any): Promise<any> {
        return await this.coursesService.updateAccess(args, args.id);
    }
    

    // MODULE CRUDs
    @SetMetadata('roles', ['admin'])
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Query()
    async getModules() {
        return await this.coursesService.findAllModules();
    }
    @Query('getHomeModules')
    async getHomeModules() {
        return await this.coursesService.getHomeModules();
    }
    @Query('Module')
    async findOneModuleById(@Args('id') id: string): Promise<any> {
        return await this.coursesService.findOneModuleById(id);
    }
    @SetMetadata('roles', ['admin'])
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Query('removeModule')
    async deleteOneModule(@Args('id') id: string): Promise<any> {
        return await this.coursesService.deleteModule(id);
    }
    @SetMetadata('roles', ['admin'])
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Mutation('createModule')
    async createModule(@Args('createModuleInput') args: any): Promise<any> {
        return await this.coursesService.createModule(args);
    }
    @SetMetadata('roles', ['admin'])
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Mutation('updateModule')
    async updateModule(@Args('updateModuleInput') args: any): Promise<any> {
        return await this.coursesService.updateModule(args, args.id);
    }
    // PROGRESS
    @UseGuards(GraphqlAuthGuard)
    @Mutation('updateProgress')
    async updateProgress(@Args('updateProgressInput') args: any, @User() user): Promise<any> {
        return await this.coursesService.updateProgress(args, user);
    }
    
    @UseGuards(GraphqlAuthGuard)
    @Query('getPathProgress')
    async getPathProgress(@Args('pathId') id, @User() user) {
        return await this.coursesService.getPathProgress(user, id);
    }
    @UseGuards(GraphqlAuthGuard)
    @Query('getAllProgress')
    async getAllProgress(@User() user) {
        return await this.coursesService.getAllAdvancements(user);
    }
    @UseGuards(GraphqlAuthGuard)
    @Mutation('updateAdvancement')
    async updateAdvancement(@Args('updateAdvanceInput') args, @User() user): Promise<any> {
        return await this.coursesService.updateAdvancement(args, user);
    }
    @UseGuards(GraphqlAuthGuard)
    @Mutation('updateAdvancementPath')
    async updateAdvancementPath(@Args('updateAdvanceInput') args, @User() user): Promise<any> {
        return await this.coursesService.updateAdvancementPath(args.path, user);
    }
    @UseGuards(GraphqlAuthGuard)
    @Mutation('updateAdvancementModule')
    async updateAdvancementModule(@Args('updateAdvanceInput') args, @User() user): Promise<any> {
        return await this.coursesService.updateAdvancementModule(args.bootcamp, user);
    }
    @UseGuards(GraphqlAuthGuard)
    @Query('getCurrentProgress')
    async getCurrentProgress(@Args('id') id, @User() user): Promise<any> {
        return await this.coursesService.getCurrentProgress(id, user);
    }
    @UseGuards(GraphqlAuthGuard)
    @Query('updateAllCoursesAdvancements')
    async updateAllCoursesAdvancements(@User() user): Promise<any> {
        return await this.coursesService.updateAllCoursesAdvancements(user);
    }
    @UseGuards(GraphqlAuthGuard)
    @Query('updateAllPathsAdvancements')
    async updateAllPathsAdvancements(@User() user): Promise<any> {
        return await this.coursesService.updateAllPathsAdvancements(user);
    }
    @UseGuards(GraphqlAuthGuard)
    @Query('updateAllBootcampsAdvancements')
    async updateAllBootcampsAdvancements(@User() user): Promise<any> {
        return await this.coursesService.updateAllBootcampsAdvancements(user);
    }
    @Query('migrateData')
    async migrateData(): Promise<any> {
        return await this.coursesService.migrateData();
    }
    
}

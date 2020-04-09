import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from '../common/guards/gql.auth.guard';
import { User } from '../common/decorators/current-user.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

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
        return await this.coursesService.deleteLevel(id);
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

    @Roles('admin')
    
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Query()
    async getChapters() {
        return await this.coursesService.findAllChapters();
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
    @Roles('admin')
    
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    // COMMENTS CRUDs
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
    async createAccess(@Args('createAccessInput') args: any): Promise<any> {
        return await this.coursesService.createAccess(args);
    }
    @Roles('admin')
    @UseGuards(GraphqlAuthGuard, RolesGuard)
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

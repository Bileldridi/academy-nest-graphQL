
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class CreateAccessInput {
    candidate?: string;
    course?: string;
    type?: string;
    level?: string;
    desc?: string;
    duration?: number;
}

export class CreateCandidateInput {
    tel?: string;
    image?: string;
    firstname?: string;
    lastname?: string;
    password?: string;
    email?: string;
    role?: string;
    sendEmail?: boolean;
}

export class CreateCatInput {
    name?: string;
    age?: number;
}

export class CreateChapterInput {
    title?: string;
    content?: string;
    course?: string;
    type?: string;
    status?: string;
    files?: string[];
}

export class CreateCoachInput {
    tel?: string;
    image?: string;
    firstname?: string;
    lastname?: string;
    createDate?: number;
    password?: string;
    email?: string;
    role?: string;
}

export class CreateCommentInput {
    author?: string;
    content?: string;
    status?: string;
}

export class CreateCourseInput {
    title?: string;
    desc?: string;
    difficulty?: string;
    levels?: string[];
    chapters?: string[];
    status?: string;
    Files?: string[];
    duration?: number;
}

export class CreateLevelInput {
    title?: string;
    courses?: string[];
    desc?: string;
    status?: string;
    duration?: number;
}

export class CreateProgressInput {
    talent?: string;
    chapter?: string;
    type?: string;
    score?: string;
    desc?: string;
}

export class CreateSessionInput {
    name?: string;
    period?: number;
    type?: string;
    startedDate?: number;
    finishDate?: number;
}

export class CreateUserInput {
    firstname?: string;
    lastname?: string;
    password?: string;
    email?: string;
    image?: string;
    candidate?: string;
    coach?: string;
    role?: string;
}

export class LoginInput {
    email?: string;
    password?: string;
}

export class UpdateAccessInput {
    id?: string;
    candidate?: string;
    course?: string;
    type?: string;
    level?: string;
    desc?: string;
    duration?: number;
}

export class UpdateCandidateInput {
    id?: string;
    tel?: string;
    image?: string;
    firstname?: string;
    lastname?: string;
    password?: string;
    email?: string;
    role?: string;
}

export class UpdateChapterInput {
    id?: string;
    title?: string;
    content?: string;
    course?: string;
    type?: string;
    status?: string;
    files?: string[];
    comments?: string[];
}

export class UpdateCoachInput {
    id?: string;
    tel?: string;
    image?: string;
    firstname?: string;
    lastname?: string;
    createDate?: number;
    password?: string;
    email?: string;
    role?: string;
}

export class UpdateCommentInput {
    id?: string;
    author?: string;
    content?: string;
    status?: string;
}

export class UpdateCourseInput {
    id?: string;
    title?: string;
    difficulty?: string;
    desc?: string;
    levels?: string[];
    chapters?: string[];
    status?: string;
    Files?: string[];
    duration?: number;
}

export class UpdateLevelInput {
    id?: string;
    title?: string;
    courses?: string[];
    desc?: string;
    status?: string;
    duration?: number;
}

export class UpdateProgressInput {
    id?: string;
    talent?: string;
    chapter?: string;
    type?: string;
    score?: string;
    desc?: string;
}

export class UpdateSessionInput {
    id?: string;
    name?: string;
    period?: number;
    type?: string;
    startedDate?: number;
    finishDate?: number;
}

export class UserInput {
    id?: string;
    image?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    role?: string;
    coach?: string;
}

export class Access {
    id?: string;
    candidate?: User;
    course?: Course;
    type?: string;
    level?: Level;
    desc?: string;
    status?: string;
    createDate?: number;
    duration?: number;
    timeLeft?: number;
}

export class Candidate {
    tel?: string;
    createDate?: number;
}

export class Cat {
    _id?: string;
    name?: string;
    age?: number;
}

export class Chapter {
    id?: string;
    title?: string;
    content?: string;
    type?: string;
    createDate?: number;
    course?: Course;
    status?: string;
    files?: string[];
    comments?: Comment[];
}

export class Coach {
    tel?: string;
    image?: string;
}

export class Comment {
    author?: User;
    content?: string;
    createDate?: number;
    status?: string;
}

export class Course {
    id?: string;
    title?: string;
    desc?: string;
    difficulty?: string;
    chapters?: Chapter[];
    comments?: Comment[];
    levels?: Level[];
    createDate?: number;
    status?: string;
    duration?: number;
    files?: string[];
}

export class Level {
    id?: string;
    title?: string;
    createDate?: number;
    courses?: Course[];
    desc?: string;
    status?: string;
    duration?: number;
}

export class Message {
    message?: string;
    accessToken?: string;
}

export abstract class IMutation {
    abstract createCandidate(createCandidateInput?: CreateCandidateInput): MyCandidate | Promise<MyCandidate>;

    abstract updateCandidate(updateCandidateInput?: UpdateCandidateInput): MyCandidate | Promise<MyCandidate>;

    abstract createCat(createCatInput?: CreateCatInput): Cat | Promise<Cat>;

    abstract createCoach(createCoachInput?: CreateCoachInput): MyUser | Promise<MyUser>;

    abstract updateCoach(updateCoachInput?: UpdateCoachInput): MyUser | Promise<MyUser>;

    abstract createAccess(createAccessInput?: CreateAccessInput): Access | Promise<Access>;

    abstract updateAccess(updateAccessInput?: UpdateAccessInput): Access | Promise<Access>;

    abstract createChapter(createChapterInput?: CreateChapterInput): Chapter | Promise<Chapter>;

    abstract updateChapter(updateChapterInput?: UpdateChapterInput): Chapter | Promise<Chapter>;

    abstract createCourse(createCourseInput?: CreateCourseInput): Course | Promise<Course>;

    abstract updateCourse(updateCourseInput?: UpdateCourseInput): Course | Promise<Course>;

    abstract createComment(createCommentInput?: CreateCommentInput): Comment | Promise<Comment>;

    abstract updateComment(updateCommentInput?: UpdateCommentInput): Comment | Promise<Comment>;

    abstract createLevel(createLevelInput?: CreateLevelInput): Level | Promise<Level>;

    abstract updateLevel(updateLevelInput?: UpdateLevelInput): Level | Promise<Level>;

    abstract createProgress(createProgressInput?: CreateProgressInput): Progress | Promise<Progress>;

    abstract updateProgress(updateProgressInput?: UpdateProgressInput): Progress | Promise<Progress>;

    abstract createSession(createSessionInput?: CreateSessionInput): Session | Promise<Session>;

    abstract updateSession(updateSessionInput?: UpdateSessionInput): Session | Promise<Session>;

    abstract createUser(createUserInput?: CreateUserInput): User | Promise<User>;

    abstract updateUser(userInput?: UserInput): Message | Promise<Message>;

    abstract login(loginInput?: LoginInput): UserLogin | Promise<UserLogin>;
}

export class MyCandidate {
    id?: string;
    firstname?: string;
    lastname?: string;
    createDate?: number;
    password?: string;
    email?: string;
    candidate?: Candidate;
    image?: string;
    role?: string;
}

export class MyUser {
    id?: string;
    firstname?: string;
    lastname?: string;
    createDate?: number;
    password?: string;
    email?: string;
    coach?: Coach;
    role?: string;
}

export class Progress {
    id?: string;
    talent?: User;
    chapter?: Chapter;
    type?: string;
    score?: string;
    desc?: string;
    createDate?: number;
}

export abstract class IQuery {
    abstract getCandidates(): MyCandidate[] | Promise<MyCandidate[]>;

    abstract Candidate(id: string): MyCandidate | Promise<MyCandidate>;

    abstract deleteCandidate(id: string): MyCandidate | Promise<MyCandidate>;

    abstract deleteCandidates(id?: string[]): MyCandidate | Promise<MyCandidate>;

    abstract getCats(): Cat[] | Promise<Cat[]>;

    abstract cat(_id: string): Cat | Promise<Cat>;

    abstract getCoaches(): MyUser[] | Promise<MyUser[]>;

    abstract Coach(id: string): MyUser | Promise<MyUser>;

    abstract deleteCoach(id: string): MyUser | Promise<MyUser>;

    abstract deleteCoaches(id?: string[]): MyUser | Promise<MyUser>;

    abstract getAccesss(): Access[] | Promise<Access[]>;

    abstract Access(id: string): Access[] | Promise<Access[]>;

    abstract LevelAccess(id: string): Access[] | Promise<Access[]>;

    abstract getCandidateAccess(id: string): Access[] | Promise<Access[]>;

    abstract removeAccess(id: string): Access | Promise<Access>;

    abstract getChapters(): Chapter[] | Promise<Chapter[]>;

    abstract Chapter(id: string): Chapter | Promise<Chapter>;

    abstract removeChapter(id: string): Chapter | Promise<Chapter>;

    abstract getCourses(): Course[] | Promise<Course[]>;

    abstract Course(id: string): Course | Promise<Course>;

    abstract removeCourse(id: string): Course | Promise<Course>;

    abstract getComments(): Course[] | Promise<Course[]>;

    abstract Comment(id: string): Comment | Promise<Comment>;

    abstract removeComment(id: string): Comment | Promise<Comment>;

    abstract getLevels(): Level[] | Promise<Level[]>;

    abstract Level(id: string): Level | Promise<Level>;

    abstract removeLevel(id: string): Level | Promise<Level>;

    abstract getProgresss(): Progress[] | Promise<Progress[]>;

    abstract Progress(id: string): Progress | Promise<Progress>;

    abstract removeProgress(id: string): Progress | Promise<Progress>;

    abstract getSessions(): Session[] | Promise<Session[]>;

    abstract Session(id: string): Session | Promise<Session>;

    abstract removeSession(id: string): Session | Promise<Session>;

    abstract addCandidate(email: string, id: string): Session | Promise<Session>;

    abstract removeCandidate(email: string, id: string): Session | Promise<Session>;

    abstract addCoach(email: string, id: string): Session | Promise<Session>;

    abstract removeCoach(email: string, id: string): Session | Promise<Session>;

    abstract getUsers(): User[] | Promise<User[]>;

    abstract getCurrentUser(): User | Promise<User>;

    abstract User(_id: string): User | Promise<User>;
}

export class Session {
    id?: string;
    period?: number;
    type?: string;
    name?: string;
    createDate?: number;
    startedDate?: number;
    finishDate?: number;
    candidates?: User[];
    coaches?: User[];
}

export abstract class ISubscription {
    abstract CandidateCreated(): MyCandidate | Promise<MyCandidate>;

    abstract catCreated(): Cat | Promise<Cat>;

    abstract CoachCreated(): MyUser | Promise<MyUser>;

    abstract AccessCreated(): Access | Promise<Access>;

    abstract ChapterCreated(): Chapter | Promise<Chapter>;

    abstract CourseCreated(): Course | Promise<Course>;

    abstract LevelCreated(): Level | Promise<Level>;

    abstract ProgressCreated(): Progress | Promise<Progress>;

    abstract SessionCreated(): Session | Promise<Session>;

    abstract UserCreated(): User | Promise<User>;
}

export class User {
    id?: string;
    firstname?: string;
    lastname?: string;
    createDate?: number;
    password?: string;
    email?: string;
    image?: string;
    candidate?: Candidate;
    coach?: Coach;
    role?: string;
}

export class UserLogin {
    message?: string;
    token?: string;
}


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
    module?: string;
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
    video?: string;
    type?: string;
    status?: string;
    quiz?: QuizInput[];
    files?: string[];
}

export class CreateChatInput {
    title?: string;
    users?: string[];
    content: string;
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
    longDesc?: string;
    pic?: string;
    price?: number;
    promotion?: number;
    assistancePrice?: number;
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
    subTitle?: string;
    desc?: string;
    pic?: string;
    shortDesc?: string;
    promotion?: number;
    status?: string;
    duration?: number;
    price?: number;
}

export class CreateModuleInput {
    title?: string;
    levels?: string[];
    subTitle?: string;
    desc?: string;
    pic?: string;
    shortDesc?: string;
    promotion?: number;
    status?: string;
    duration?: number;
    price?: number;
}

export class CreateOrderInput {
    course?: string;
    level?: string;
    assistance: boolean;
    firstname: string;
    lastname: string;
    email: string;
    promotion: number;
    tel: string;
    zip: string;
    city: string;
    country: string;
    mode: string;
    method: string;
}

export class CreateProgressInput {
    candidate?: string;
    chapter?: string;
    type?: string;
    score?: number;
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
    note?: string;
    role?: string;
    tel?: string;
    address?: string;
    country?: string;
    postcode?: string;
    sendEmail?: boolean;
}

export class LoginInput {
    email?: string;
    password?: string;
}

export class OptionInput {
    option?: string;
}

export class QuizAnswerInput {
    id?: string;
    answers?: number[];
}

export class QuizInput {
    question?: string;
    correctAnswer?: number;
    options?: OptionInput[];
}

export class SendMessageInput {
    content?: string;
    type?: string;
    chatId?: string;
}

export class UpdateAccessInput {
    id?: string;
    candidate?: string;
    course?: string;
    type?: string;
    level?: string;
    module?: string;
    desc?: string;
    duration?: number;
}

export class UpdateAdvanceInput {
    id?: string;
    lastChapter?: string;
    checkedChapters?: string[];
    path?: string;
    bootcamp?: string;
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
    video?: string;
    type?: string;
    status?: string;
    files?: string[];
    comments?: string[];
    quiz?: QuizInput[];
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
    price?: number;
    assistancePrice?: number;
    longDesc?: string;
    promotion?: number;
    pic?: string;
    levels?: string[];
    modules?: string[];
    chapters?: string[];
    status?: string;
    Files?: string[];
    duration?: number;
}

export class UpdateLevelInput {
    id?: string;
    title?: string;
    courses?: string[];
    subTitle?: string;
    desc?: string;
    pic?: string;
    promotion?: number;
    shortDesc?: string;
    status?: string;
    duration?: number;
    price?: number;
}

export class UpdateModuleInput {
    id?: string;
    title?: string;
    levels?: string[];
    subTitle?: string;
    desc?: string;
    pic?: string;
    promotion?: number;
    shortDesc?: string;
    status?: string;
    duration?: number;
    price?: number;
}

export class UpdateOrderInput {
    id?: string;
    assistance?: boolean;
    firstname?: string;
    lastname?: string;
    email?: string;
    tel?: string;
    zip?: string;
    city?: string;
    country?: string;
    status?: string;
}

export class UpdateProgressInput {
    id?: string;
    candidate?: string;
    chapter?: string;
    type?: string;
    score?: number;
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
    password?: string;
    role?: string;
    tel?: string;
    note?: string;
    coach?: string;
    sendEmail?: boolean;
    generate?: boolean;
}

export class VerifCode {
    code?: string;
}

export class Access {
    id?: string;
    candidate?: User;
    course?: Course;
    type?: string;
    level?: Level;
    module?: Module;
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

export class Certificate {
    id?: string;
    candidate?: User;
    code?: string;
    imgURL?: string;
    pathId?: Level;
}

export class Chapter {
    id?: string;
    title?: string;
    content?: string;
    video?: string;
    type?: string;
    createDate?: number;
    course?: Course;
    status?: string;
    files?: string[];
    comments?: Comment[];
    quiz?: Quiz[];
}

export class Chat {
    id?: string;
    creator?: User;
    users?: User[];
    messages?: ChatMessage[];
    lastMessage?: ChatMessage;
    title?: string;
    createDate?: number;
    seen?: boolean;
    conference?: Conference;
}

export class ChatMessage {
    id?: string;
    sender?: User;
    isRead?: boolean;
    content?: string;
    type?: string;
    createDate?: number;
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

export class Conference {
    id?: string;
    creator?: string;
    join_url?: string;
    start_url?: string;
    createDate?: string;
    chat?: Chat;
}

export class Contact {
    id?: string;
    firstname?: string;
    lastname?: string;
    image?: string;
}

export class Course {
    id?: string;
    title?: string;
    desc?: string;
    longDesc?: string;
    pic?: string;
    promotion?: number;
    difficulty?: string;
    chapters?: Chapter[];
    comments?: Comment[];
    levels?: Level[];
    modules?: Module[];
    createDate?: number;
    assistancePrice?: number;
    status?: string;
    duration?: number;
    price?: number;
    files?: string[];
}

export class CourseProgress {
    id?: string;
    lastChapter?: string;
    checkedChapters?: string[];
}

export class Level {
    id?: string;
    title?: string;
    createDate?: number;
    courses?: Course[];
    subTitle?: string;
    desc?: string;
    pic?: string;
    promotion?: number;
    shortDesc?: string;
    status?: string;
    duration?: number;
    price?: number;
}

export class Message {
    message?: string;
    accessToken?: string;
}

export class Module {
    id?: string;
    title?: string;
    createDate?: number;
    levels?: Level[];
    subTitle?: string;
    desc?: string;
    pic?: string;
    promotion?: number;
    shortDesc?: string;
    status?: string;
    duration?: number;
    price?: number;
}

export abstract class IMutation {
    abstract createCandidate(createCandidateInput?: CreateCandidateInput): MyCandidate | Promise<MyCandidate>;

    abstract updateCandidate(updateCandidateInput?: UpdateCandidateInput): MyCandidate | Promise<MyCandidate>;

    abstract createCat(createCatInput?: CreateCatInput): Cat | Promise<Cat>;

    abstract addCertificate(pathId: string): Certificate | Promise<Certificate>;

    abstract updateCertificate(urlImg?: string, id?: string): Certificate | Promise<Certificate>;

    abstract updateCertificateAdmin(urlImg?: string, idPath?: string, idUser?: string): Certificate | Promise<Certificate>;

    abstract sendMessage(sendMessageInput?: SendMessageInput): Message | Promise<Message>;

    abstract createChat(createChatInput?: CreateChatInput): Message | Promise<Message>;

    abstract createCoach(createCoachInput?: CreateCoachInput): MyUser | Promise<MyUser>;

    abstract updateCoach(updateCoachInput?: UpdateCoachInput): MyUser | Promise<MyUser>;

    abstract createAccess(createAccessInput?: CreateAccessInput): Access | Promise<Access>;

    abstract updateAccess(updateAccessInput?: UpdateAccessInput): Access | Promise<Access>;

    abstract createChapter(createChapterInput?: CreateChapterInput): Chapter | Promise<Chapter>;

    abstract submitQuiz(quizAnswerInput?: QuizAnswerInput): Message | Promise<Message>;

    abstract updateChapter(updateChapterInput?: UpdateChapterInput): Chapter | Promise<Chapter>;

    abstract createCourse(createCourseInput?: CreateCourseInput): Course | Promise<Course>;

    abstract updateCourse(updateCourseInput?: UpdateCourseInput): Course | Promise<Course>;

    abstract createComment(createCommentInput?: CreateCommentInput): Comment | Promise<Comment>;

    abstract updateComment(updateCommentInput?: UpdateCommentInput): Comment | Promise<Comment>;

    abstract createLevel(createLevelInput?: CreateLevelInput): Level | Promise<Level>;

    abstract updateLevel(updateLevelInput?: UpdateLevelInput): Level | Promise<Level>;

    abstract createModule(createModuleInput?: CreateModuleInput): Module | Promise<Module>;

    abstract updateModule(updateModuleInput?: UpdateModuleInput): Module | Promise<Module>;

    abstract createProgress(createProgressInput?: CreateProgressInput): Progress | Promise<Progress>;

    abstract updateAdvancement(updateAdvanceInput?: UpdateAdvanceInput): Progress | Promise<Progress>;

    abstract updateAdvancementPath(updateAdvanceInput?: UpdateAdvanceInput): Progress | Promise<Progress>;

    abstract updateAdvancementModule(updateAdvanceInput?: UpdateAdvanceInput): Progress | Promise<Progress>;

    abstract updateProgress(updateProgressInput?: UpdateProgressInput): Progress | Promise<Progress>;

    abstract createOrder(createOrderInput?: CreateOrderInput): Message | Promise<Message>;

    abstract updateOrder(updateOrderInput?: UpdateOrderInput): Message | Promise<Message>;

    abstract createSession(createSessionInput?: CreateSessionInput): Session | Promise<Session>;

    abstract updateSession(updateSessionInput?: UpdateSessionInput): Session | Promise<Session>;

    abstract register(createUserInput?: CreateUserInput): UserRegister | Promise<UserRegister>;

    abstract createUser(createUserInput?: CreateUserInput): User | Promise<User>;

    abstract updateUser(userInput?: UserInput): User | Promise<User>;

    abstract login(loginInput?: LoginInput): UserLogin | Promise<UserLogin>;

    abstract firstLogin(verifCode?: VerifCode): UserLogin | Promise<UserLogin>;
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

export class Option {
    option?: string;
}

export class Order {
    id?: string;
    course?: Course;
    level?: Level;
    createDate?: number;
    orderId?: string;
    assistance?: boolean;
    promotion?: number;
    firstname?: string;
    lastname?: string;
    email?: string;
    tel?: string;
    zip?: string;
    city?: string;
    country?: string;
    status?: Status[];
    payment?: Payment;
}

export class Payment {
    createDate?: number;
    mode?: string;
    transfereId?: string;
    method?: string;
    amount?: number;
}

export class Progress {
    id?: string;
    candidate?: User;
    chapter?: Chapter;
    type?: string;
    score?: number;
    desc?: string;
    createDate?: number;
    course?: CourseProgress;
    path?: string;
    bootcamp?: string;
    progress?: number;
}

export class ProgressUpdate {
    id?: string;
    candidate?: User;
    chapter?: Chapter;
    type?: string;
    score?: number;
    desc?: string;
    createDate?: number;
}

export class PublicChapter {
    id?: string;
    title?: string;
}

export class PublicCourse {
    id?: string;
    title?: string;
    desc?: string;
    longDesc?: string;
    pic?: string;
    price?: number;
    status?: string;
    promotion?: number;
    assistancePrice?: number;
    difficulty?: string;
    chapters?: PublicChapter[];
    duration?: number;
}

export class PublicLevel {
    id?: string;
    title?: string;
    courses?: PublicCourse[];
    subTitle?: string;
    desc?: string;
    status?: string;
    promotion?: number;
    shortDesc?: string;
    pic?: string;
    price?: number;
}

export class PublicModule {
    id?: string;
    title?: string;
    levels?: PublicLevel[];
    subTitle?: string;
    desc?: string;
    status?: string;
    promotion?: number;
    shortDesc?: string;
    pic?: string;
    price?: number;
}

export abstract class IQuery {
    abstract hello(): Message | Promise<Message>;

    abstract getCandidates(): MyCandidate[] | Promise<MyCandidate[]>;

    abstract Candidate(id: string): MyCandidate | Promise<MyCandidate>;

    abstract deleteCandidate(id: string): MyCandidate | Promise<MyCandidate>;

    abstract deleteCandidates(id?: string[]): MyCandidate | Promise<MyCandidate>;

    abstract getCats(): Cat[] | Promise<Cat[]>;

    abstract cat(_id: string): Cat | Promise<Cat>;

    abstract getCertificate(code: string): Certificate | Promise<Certificate>;

    abstract getCertificateAdmin(idUser: string, idPath: string): Certificate | Promise<Certificate>;

    abstract getChats(): Chat[] | Promise<Chat[]>;

    abstract Chat(id: string): Chat | Promise<Chat>;

    abstract startZoom(id: string): Message | Promise<Message>;

    abstract readMessage(id?: string): Message | Promise<Message>;

    abstract getContacts(): Contact[] | Promise<Contact[]>;

    abstract getCoaches(): MyUser[] | Promise<MyUser[]>;

    abstract Coach(id: string): MyUser | Promise<MyUser>;

    abstract deleteCoach(id: string): MyUser | Promise<MyUser>;

    abstract deleteCoaches(id?: string[]): MyUser | Promise<MyUser>;

    abstract getAccesss(): Access[] | Promise<Access[]>;

    abstract Access(id: string): Access[] | Promise<Access[]>;

    abstract LevelAccess(id: string): Access[] | Promise<Access[]>;

    abstract ModuleAccess(id: string): Access[] | Promise<Access[]>;

    abstract getCandidateAccess(id: string): Access[] | Promise<Access[]>;

    abstract getCurrentCandidateAccess(): Access[] | Promise<Access[]>;

    abstract removeAccess(id: string): Message | Promise<Message>;

    abstract getChapters(): Chapter[] | Promise<Chapter[]>;

    abstract Chapter(id: string): Chapter | Promise<Chapter>;

    abstract checkQuiz(id: string): Message | Promise<Message>;

    abstract removeChapter(id: string): Message | Promise<Message>;

    abstract getCourses(): Course[] | Promise<Course[]>;

    abstract getFeaturedCourses(): PublicCourse[] | Promise<PublicCourse[]>;

    abstract getHomeCourses(): PublicCourse[] | Promise<PublicCourse[]>;

    abstract Course(id: string): Course | Promise<Course>;

    abstract removeCourse(id: string): Message | Promise<Message>;

    abstract getComments(): Course[] | Promise<Course[]>;

    abstract Comment(id: string): Comment | Promise<Comment>;

    abstract removeComment(id: string): Comment | Promise<Comment>;

    abstract getLevels(): Level[] | Promise<Level[]>;

    abstract Level(id: string): Level | Promise<Level>;

    abstract getHomeLevels(): PublicLevel[] | Promise<PublicLevel[]>;

    abstract removeLevel(id: string): Message | Promise<Message>;

    abstract getModules(): Module[] | Promise<Module[]>;

    abstract Module(id: string): Module | Promise<Module>;

    abstract getHomeModules(): PublicModule[] | Promise<PublicModule[]>;

    abstract removeModule(id: string): Message | Promise<Message>;

    abstract getAllProgress(): Progress[] | Promise<Progress[]>;

    abstract Progress(id: string): Progress | Promise<Progress>;

    abstract removeProgress(id: string): Message | Promise<Message>;

    abstract getCurrentProgress(id: string): Progress | Promise<Progress>;

    abstract updateAllPathsAdvancements(): Progress | Promise<Progress>;

    abstract updateAllBootcampsAdvancements(): Progress | Promise<Progress>;

    abstract updateAllCoursesAdvancements(): Progress | Promise<Progress>;

    abstract getPathProgress(pathId: string): Progress | Promise<Progress>;

    abstract getOrders(): Order[] | Promise<Order[]>;

    abstract Order(id: string): Order | Promise<Order>;

    abstract deleteOrder(id: string): Message | Promise<Message>;

    abstract getSessions(): Session[] | Promise<Session[]>;

    abstract Session(id: string): Session | Promise<Session>;

    abstract removeSession(id: string): Session | Promise<Session>;

    abstract addCandidate(email: string, id: string): Session | Promise<Session>;

    abstract removeCandidate(email: string, id: string): Session | Promise<Session>;

    abstract addCoach(email: string, id: string): Session | Promise<Session>;

    abstract removeCoach(email: string, id: string): Session | Promise<Session>;

    abstract getUsers(): User[] | Promise<User[]>;

    abstract getCurrentUser(): User | Promise<User>;

    abstract User(id: string): User | Promise<User>;

    abstract deleteUser(id: string): Message | Promise<Message>;

    abstract recover(email: string): Message | Promise<Message>;

    abstract check(email: string, password: string, recoveryPass: string): Message | Promise<Message>;
}

export class Quiz {
    question?: string;
    correctAnswer?: string;
    options?: Option[];
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

export class Status {
    createDate?: number;
    status?: string;
}

export abstract class ISubscription {
    abstract CandidateCreated(): MyCandidate | Promise<MyCandidate>;

    abstract catCreated(): Cat | Promise<Cat>;

    abstract messageSent(id: string): Message | Promise<Message>;

    abstract CoachCreated(): MyUser | Promise<MyUser>;

    abstract AccessCreated(): Access | Promise<Access>;

    abstract ChapterCreated(): Chapter | Promise<Chapter>;

    abstract CourseCreated(): Course | Promise<Course>;

    abstract LevelCreated(): Level | Promise<Level>;

    abstract ModuleCreated(): Module | Promise<Module>;

    abstract ProgressCreated(): Progress | Promise<Progress>;

    abstract SessionCreated(): Session | Promise<Session>;

    abstract UserCreated(): User | Promise<User>;
}

export class User {
    id?: string;
    firstname?: string;
    lastname?: string;
    createDate?: number;
    lastLogin?: number;
    email?: string;
    image?: string;
    tel?: string;
    address?: string;
    country?: string;
    postcode?: string;
    note?: string;
    candidate?: Candidate;
    coach?: Coach;
    role?: string;
    status?: string;
}

export class UserLogin {
    message?: string;
    token?: string;
}

export class UserRegister {
    message?: string;
}

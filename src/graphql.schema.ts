
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class CreateCandidateInput {
    tel?: string;
    image?: string;
    firstname?: string;
    lastname?: string;
    createDate?: number;
    password?: string;
    email?: string;
    role?: string;
}

export class CreateCatInput {
    name?: string;
    age?: number;
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
    candidate?: string;
    coach?: string;
    role?: string;
}

export class LoginInput {
    email?: string;
    password?: string;
}

export class UpdateCandidateInput {
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

export class UpdateSessionInput {
    id?: string;
    name?: string;
    period?: number;
    type?: string;
    startedDate?: number;
    finishDate?: number;
}

export class Candidate {
    tel?: string;
    image?: string;
}

export class Cat {
    _id?: string;
    name?: string;
    age?: number;
}

export class Coach {
    tel?: string;
    image?: string;
}

export abstract class IMutation {
    abstract createCandidate(createCandidateInput?: CreateCandidateInput): MyCandidate | Promise<MyCandidate>;

    abstract updateCandidate(updateCandidateInput?: UpdateCandidateInput): MyCandidate | Promise<MyCandidate>;

    abstract createCat(createCatInput?: CreateCatInput): Cat | Promise<Cat>;

    abstract createCoach(createCoachInput?: CreateCoachInput): MyUser | Promise<MyUser>;

    abstract updateCoach(updateCoachInput?: UpdateCoachInput): MyUser | Promise<MyUser>;

    abstract createSession(createSessionInput?: CreateSessionInput): Session | Promise<Session>;

    abstract updateSession(updateSessionInput?: UpdateSessionInput): Session | Promise<Session>;

    abstract createUser(createUserInput?: CreateUserInput): User | Promise<User>;

    abstract login(loginInput?: LoginInput): User | Promise<User>;
}

export class MyCandidate {
    id?: string;
    firstname?: string;
    lastname?: string;
    createDate?: number;
    password?: string;
    email?: string;
    candidate?: Candidate;
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

    abstract getSessions(): Session[] | Promise<Session[]>;

    abstract Session(id: string): Session | Promise<Session>;

    abstract removeSession(id: string): Session | Promise<Session>;

    abstract addCandidate(email: string, id: string): Session | Promise<Session>;

    abstract removeCandidate(email: string, id: string): Session | Promise<Session>;

    abstract addCoach(email: string, id: string): Session | Promise<Session>;

    abstract removeCoach(email: string, id: string): Session | Promise<Session>;

    abstract getUsers(): User[] | Promise<User[]>;

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
    candidate?: Candidate;
    coach?: Coach;
    role?: string;
}

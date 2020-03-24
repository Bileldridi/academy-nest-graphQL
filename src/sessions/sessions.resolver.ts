
import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Session } from '../graphql.schema';
// import { SessionsGuard } from './Sessions.guard';
import { SessionsService } from './sessions.service';
// import { CreateSessionDto } from './dto/create-Session.dto';

const pubSub = new PubSub();

@Resolver('Sessions')
export class SessionsResolver {
    constructor(private readonly sessionsService: SessionsService) { }

    // { getSessions {name, age} }
    @Query()
    // @UseGuards(SessionsGuard)
    async getSessions() {
        return await this.sessionsService.findAll();
    }

    // { Session(_id: "5d5860d2c4173b28f4295f51") {name,age}}
    @Query('Session')
    async findOneById(@Args('id') id: string): Promise<Session> {
        return await this.sessionsService.findOneById(id);
    }
 
    @Query('addCandidate')
    async addCandidate(@Args('email') email: string, @Args('id') id: string): Promise<Session> {
        return await this.sessionsService.addCandidate(email, id);
    }
    @Query('removeCandidate')
    async deleteCandidate(@Args('email') email: string, @Args('id') id: string): Promise<Session> {
        return await this.sessionsService.deleteCandidate(email, id);
    }
    @Query('addCoach')
    async addCoach(@Args('email') email: string, @Args('id') id: string): Promise<Session> {
        return await this.sessionsService.addCoach(email, id);
    }
    @Query('removeCoach')
    async deleteCoach(@Args('email') email: string, @Args('id') id: string): Promise<Session> {
        return await this.sessionsService.deleteCoach(email, id);
    }
    @Query('removeSession')
    async deleteSession(@Args('id') id: string): Promise<Session> {
        return await this.sessionsService.deleteSession(id);
    }

    // mutation{
    //   createSession(
    //     createSessionInput:{name:"mimi", age:12}
    //   ) {name}
    // }
    @Mutation('createSession')
    async create(@Args('createSessionInput') args: any): Promise<Session> {
        const createdSession = await this.sessionsService.create(args);
        pubSub.publish('SessionCreated', { SessionCreated: createdSession });
        return createdSession;
    }
    @Mutation('updateSession')
    async update(@Args('updateSessionInput') args: any): Promise<Session> {
        const updatedSession = await this.sessionsService.update(args);
        return updatedSession;
    }

    @Subscription('SessionCreated')
    SessionCreated() {
        return pubSub.asyncIterator('SessionCreated');
    }
}

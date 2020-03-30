import { Resolver, Mutation, Args, Query, Subscription } from '@nestjs/graphql';
import { CoachesService } from './coaches.service';
import { PubSub } from 'graphql-subscriptions';
const pubSub = new PubSub();

@Resolver('Coaches')
export class CoachesResolver {

    constructor(private readonly coachesService: CoachesService) { }

    @Query()
    async getCoaches() {
        return await this.coachesService.findAll();
    }
    @Query('Coach')
    async findOneById(@Args('_id') id: string): Promise<any> {
        return await this.coachesService.findOneById(id);
    }
    @Query('deleteCoach')
    async deleteOne(@Args('id') id: string): Promise<any> {
        return await this.coachesService.deleteOne(id);
    }
    @Query('deleteCoaches')
    async deleteOnes(@Args('id') id: [string]): Promise<any> {
        return await this.coachesService.deleteOnes(id);
    }

    @Mutation('createCoach')
    async create(@Args('createCoachInput') args: any): Promise<any> {
        // 
        const result = await this.coachesService.create(args);
        return result;
    }
    @Mutation('updateCoach')
    async update(@Args('updateCoachInput') args: any): Promise<any> {
        

        return await this.coachesService.update(args, args.id);
    }

    @Subscription('CoachCreated')
    SessionCreated() {
        return pubSub.asyncIterator('CoachCreated');
    }
}

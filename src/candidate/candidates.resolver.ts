import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CandidatesService } from './candidates.service';

@Resolver('Candidates')
export class CandidatesResolver {
    constructor(private readonly candidatesService: CandidatesService) { }

    @Query()
    async getCandidates() {
        return await this.candidatesService.findAll();
    }
    @Query('Candidate')
    async findOneById(@Args('_id') id: string): Promise<any> {
        return await this.candidatesService.findOneById(id);
    }
    @Query('deleteCandidate')
    async deleteOne(@Args('id') id: string): Promise<any> {
        return await this.candidatesService.deleteOne(id);
    }
    @Query('deleteCandidates')
    async deleteOnes(@Args('id') id: [string]): Promise<any> {
        return await this.candidatesService.deleteOnes(id);
    }

    @Mutation('createCandidate')
    async create(@Args('createCandidateInput') args: any): Promise<any> {
        console.log('hello', args);
        const result = await this.candidatesService.create(args);
        return result;
    }
    @Mutation('updateCandidate')
    async update(@Args('updateCandidateInput') args: any): Promise<any> {
        console.log('hello');

        return await this.candidatesService.update(args, args.id);
    }
}

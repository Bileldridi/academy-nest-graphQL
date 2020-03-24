import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';

@Resolver('Users')
export class UsersResolver {

    constructor(private readonly usersService: UsersService) { }

    // @Query()
    async getUsers() {
        return await this.usersService.findAll();
    }

    @Query('User')
    async findOneById(@Args('_id') id: string): Promise<any> {
        return await this.usersService.findOneById(id);
    }

    @Mutation('createUser')
    async create(@Args('createUserInput') args: any): Promise<any> {
        const createdUser = await this.usersService.create(args);
        return createdUser;
    }
    @Mutation('login')
    async login(@Args('loginInput') args: any): Promise<any> {
        return await this.usersService.login(args);
    }
    @Mutation('updateUser')
    async updateUser(@Args('userInput') args: any): Promise<any> {
        return await this.usersService.updateUser(args, args.id);
    }
}

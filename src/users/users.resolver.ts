import { Resolver, Query, Args, Mutation, GqlExecutionContext } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Controller, Request, Post, UseGuards, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '../common/passport/auth.guard';
import { GraphqlAuthGuard } from './gql.auth.guard';
import { User } from './current-user.decorator';


@Resolver('Users')
export class UsersResolver {

    constructor(private readonly usersService: UsersService) { }

    // @UseGuards(AuthGuard('jwt'))
    @UseGuards(GraphqlAuthGuard)
    @Query('getUsers')
    async getUsers(@User() user) {
        console.log('user', user);

        return await this.usersService.findAll();
    }

    @UseGuards(GraphqlAuthGuard)
    @Query('getCurrentUser')
    async getCurrentUser(@User() user) {
        return user;
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
        // console.log(args);
        return await this.usersService.login(args);
    }
    @Mutation('updateUser')
    async updateUser(@Args('userInput') args: any): Promise<any> {
        return await this.usersService.updateUser(args, args.id);
    }
}

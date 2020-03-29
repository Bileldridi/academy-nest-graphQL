import { Resolver, Query, Args, Mutation, GqlExecutionContext } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Controller, Request, Post, UseGuards, createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '../common/passport/auth.guard';
import { GraphqlAuthGuard } from '../common/guards/gql.auth.guard';
import { User } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';


@Resolver('Users')
export class UsersResolver {

    constructor(private readonly usersService: UsersService) { }

    // @UseGuards(AuthGuard('jwt'))
    @SetMetadata('roles', ['admin'])
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Query('getUsers')
    async getUsers(@User() user) {
        console.log('user', user);

        return await this.usersService.findAll();
    }

    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Query('getCurrentUser')
    async getCurrentUser(@User() user) {
        return user;
    }

    @Query('User')
    async findOneById(@Args('_id') id: string): Promise<any> {
        return await this.usersService.findOneById(id);
    }
    @Query('check')
    async recoverAccountCheck(@Args('email') email: string, @Args('password') password: string, @Args('recoveryPass') recoveryPass: string): Promise<any> {
        return await this.usersService.recoverAccountCheck(email, recoveryPass, password);
    }
    @Query('recover')
    async recoverAccountRequest(@Args('email') email: string): Promise<any> {
        return await this.usersService.recoverAccountRequest(email);
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

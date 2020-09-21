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


        return await this.usersService.findAll();
    }

    // @Roles('admin')
    @UseGuards(GraphqlAuthGuard)
    @Query('getCurrentUser')
    async getCurrentUser(@User() user) {
        return user;
    }
    @Query('User')
    async findOneById(@Args('id') id: string): Promise<any> {
        return await this.usersService.findOneById(id);
    }

    @Query('Ban')
    async findBan(@Args('id') id: String): Promise<any> {
        return await this.usersService.getBan(id)
    }
    @Query('getBans')
    async findAllBans(): Promise<any> {
        return await this.usersService.getAllBans();
    }

    @SetMetadata('roles', ['admin'])
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Query('deleteUser')
    async deleteUser(@Args('id') id: string): Promise<any> {
        return await this.usersService.deleteUser(id);
    }
    @Query('check')
    async recoverAccountCheck(@Args('email') email: string, @Args('password') password: string, @Args('recoveryPass') recoveryPass: string): Promise<any> {
        return await this.usersService.recoverAccountCheck(email, recoveryPass, password);
    }
    @Query('recover')
    async recoverAccountRequest(@Args('email') email: string): Promise<any> {
        return await this.usersService.recoverAccountRequest(email);
    }

    @SetMetadata('roles', ['admin'])
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
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

    @Mutation('register')
    async register(@Args('createUserInput') args: any): Promise<any> {
        return await this.usersService.register(args);
    }

    @Mutation('firstLogin')
    async firstLogin(@Args('verifCode') args: string): Promise<any> {
        return await this.usersService.firstLogin(args)
    }
    @Mutation('userStatus')
    async userStatus(@Args('banStatus') id: any): Promise<any> {
        return await this.usersService.userStatus(id);
    }
}

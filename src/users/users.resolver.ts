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
    async getUsers(@User() user): Promise<any> {
        return await this.usersService.findAll();
    }
    @SetMetadata('roles', ['admin'])
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Query('scrollUsers')
    async scrollUsers(@Args('scroll') scroll): Promise<any> {
        return await this.usersService.findAllUsers(scroll);
    }

    // @SetMetadata('roles', ['admin'])
    // @UseGuards(GraphqlAuthGuard, RolesGuard)
    // @Roles('admin')
    // @Query('filteredUsers')
    // async filterdUsers(@Args('search') search) {
    //     return await this.usersService.filterUsers(search)
    // }

    // @Roles('admin')
    @UseGuards(GraphqlAuthGuard)
    @Query('getCurrentUser')
    async getCurrentUser(@User() user): Promise<any> {
        return await this.usersService.findOneById(user.id);
    }
    @Query('User')
    async findOneById(@Args('id') id: string): Promise<any> {
        return await this.usersService.findOneById(id);
    }

    // @Query('Ban')
    // async findBan(@Args('id') id: String): Promise<any> {
    //     return await this.usersService.getBan(id)
    // }
    // @Query('getBans')
    // async findAllBans(): Promise<any> {
    //     return await this.usersService.getAllBans();
    // }

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
    @UseGuards(GraphqlAuthGuard)
    @Query('getAllEmails')
    async getAllEmails(): Promise<any> {
        return await this.usersService.getAllEmails();
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
    async userStatus(@Args('banStatus') args: any): Promise<any> {
        const { id, reason } = args;
        return await this.usersService.userStatus(id, reason);
    }
    @Mutation('usersStatus')
    async usersStatus(@Args('banStatus') args: any[]): Promise<any> {
        return await this.usersService.multiUsersStatus(args);
    }
}

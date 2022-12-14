import { Resolver, Query, Args, Mutation, Subscription } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { UseGuards, Inject } from '@nestjs/common';
import { GraphqlAuthGuard } from '../common/guards/gql.auth.guard';
import { User } from '../common/decorators/current-user.decorator';
import { PubSub } from 'graphql-subscriptions';
import { PubSubEngine } from 'graphql-subscriptions';

// const pubSub = new PubSub();
@Resolver('Chat')
export class ChatResolver {

    constructor(
        private readonly chatService: ChatService,
        @Inject('PUB_SUB') private pubSub: PubSubEngine) { }

    @UseGuards(GraphqlAuthGuard)
    @Query('getChats')
    async getChats(@User() user) {
        return await this.chatService.getChats(user.id)
    }

    @UseGuards(GraphqlAuthGuard)
    @Query('Chat')
    async getChat(@Args('id') id: string, ) {
        return await this.chatService.getChat(id)
    }
    @UseGuards(GraphqlAuthGuard)
    @Query('startZoom')
    async startZoom(@Args('id') id: string, @User() user) {
        return await this.chatService.createMeeting(id, user.id);
    }

    @UseGuards(GraphqlAuthGuard)
    @Query('readMessage')
    async readMessage(@Args('id') id: String, @User() user) {
        const result = await this.chatService.readMessage(user.id, id);
        this.pubSub.publish('messageSent', { messageSent: [user.id] });
        return result;
    }
    @UseGuards(GraphqlAuthGuard)
    @Query('getContacts')
    async getContacts() {
        return await this.chatService.getContacts();
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation('sendMessage')
    async sendMessage(@Args('sendMessageInput') args: any, @User() user) {
        const result = await this.chatService.sendMessage(user.id, args, args.chatId)
        this.pubSub.publish('messageSent', { messageSent: result.ids });
        return { message: result.message };
    }
    @UseGuards(GraphqlAuthGuard)
    @Mutation('createChat')
    async createChat(@Args('createChatInput') args: any, @User() user) {
        return await this.chatService.createChat(user.id, args)
    }

    @Subscription('messageSent', {
        filter: (payload, variables) => payload.messageSent.includes(variables.id)
    })
    messageSent(@Args('id') id: string) {
        return this.pubSub.asyncIterator('messageSent');
    }
}

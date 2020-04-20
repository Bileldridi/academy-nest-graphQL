import { Module } from '@nestjs/common';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import { UserSchema } from '../users/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from './schemas/chat.schema';
import { MessageSchema } from './schemas/message.schema';
import { ConferenceSchema } from './schemas/conference.schema';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as Redis from 'ioredis';

const redishost = process.env.redishost || 'localhost';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: 'Conference', schema: ConferenceSchema }]),
  ],
  providers: [ChatResolver, ChatService,
    {
      provide: 'PUB_SUB',
      useFactory: () => {
        const options = {
          host: redishost,
          port: 6379
        };

        return new RedisPubSub({
          publisher: new Redis(options),
          subscriber: new Redis(options),
        });
      }
    }
  ]
})
export class ChatModule { }

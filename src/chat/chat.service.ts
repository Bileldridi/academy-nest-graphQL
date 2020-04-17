import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

const Zoom = require("zoomus")({
    key: "JNfIY3RzRRWOZIrdlynAQQ",
    secret: "oZUxNVXZMyNov2bajtAZpVK41ovp9xNCSAz2"
});

@Injectable()
export class ChatService {

    constructor(
        @InjectModel('User') private readonly userModel: Model<any>,
        @InjectModel('Chat') private readonly chatModel: Model<any>,
        @InjectModel('Message') private readonly messageModel: Model<any>,
        @InjectModel('Conference') private readonly conferenceModel: Model<any>,

    ) { }

    async getChats(userId) {
        return await this.chatModel.find({ users: userId }).populate('users').populate({ path: 'lastMessage', populate: { path: 'sender' } })
            .sort({ 'updateDate': -1 }).exec().then(data => data.map(chat => { chat['seen'] = chat.readBy.includes(userId); return chat; }))
    }

    async getChat(_id) {
        const result = await this.chatModel.findOne({ _id })
            .populate({ path: 'lastMessage', populate: { path: 'sender' } })
            .populate('users').populate('creator').populate('conference')
            .populate({ path: 'messages', populate: { path: 'sender' } })
        return result //? result : { id: 'none' }
    }

    async sendMessage(userId, message, chatId) {
        const result = await this.messageModel.create({ ...message, sender: userId }).catch(err => err);
        const chat = await this.chatModel.findOneAndUpdate({ _id: chatId }, { $push: { messages: result.id }, $set: { updateDate: Date.now(), lastMessage: result.id, readBy: [userId] } });
        return result.id ? { message: 'OK', ids: chat.users } : { message: 'NOT OK', ids: [] };
    }
    async createChat(userId, chat) {
        const result = await this.chatModel.create({ ...chat, creator: userId, readby: [userId] }).catch(err => err)
        const message = await this.messageModel.create({ content: chat.content, sender: userId, chat: result.id })
        await this.chatModel.findOneAndUpdate({ _id: result.id }, { $push: { messages: message.id }, $set: { lastMessage: message.id } });
        return result.id ? { message: 'OK' } : { message: 'NOT OK' }
    }
    async readMessage(userId, chatId) {
        const result = await this.chatModel.findOneAndUpdate({ _id: chatId }, { $push: { readBy: userId } }).catch(err => err)
        return { message: 'OK' }
    }
    async getContacts() {
        return await this.userModel.find({ role: { $in: ['admin', 'coach'] } });
    }

    async createMeeting(_id, userId) {
        const chat = await this.chatModel.findOne({ _id }).exec();
        const meeting = {
            host_id: 'ehgKvfRvR4WWRCPWc4W7qg',
            type: 2,
            topic: chat.title,
            duration: 120,
            start_time: new Date().toISOString()
        }
        const result = new Promise((resolve, reject) => {
            Zoom.meeting.create(meeting, async (response) => {
                console.log(response);
                const conf = await this.conferenceModel.create({
                    start_url: response.start_url,
                    join_url: response.join_url,
                    chat: chat.id,
                    creator: userId,
                }).catch(err => err)
                await this.chatModel.updateOne({ _id }, { $set: { conference: conf.id } })
                resolve({ message: response.join_url })
            });
        });
        return result;
    }
}

import { Injectable } from "@nestjs/common";
import { CreateChatDto } from "./dto/create-chat.dto";
import { ChatsList, ChatsListDocument } from "./schema/chats.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(ChatsList.name)
    private readonly chatsModel: Model<ChatsListDocument>,
  ) {}

  async create(createChatDto: CreateChatDto) {
    const result = await this.chatsModel.create(createChatDto);
    return result;
  }

  async findAll(userId: string) {
    const result = await this.chatsModel
      .find({
        participants: { $elemMatch: { userId } },
      })
      .populate("participants", "username userPic isOnline");
    return result;
  }
  getChatListWithUnreadCount(userId: string) {
    return `This action returns all chats with unread count for user ${userId}`;
  }
}

import { Injectable } from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { InjectModel } from "@nestjs/mongoose";
import {
  ChatReadStatus,
  LastSeenDocument,
  Messages,
  MessagesDocument,
} from "./schema/message.schema";
import { Model } from "mongoose";

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Messages.name)
    private readonly messagesModel: Model<MessagesDocument>,
    @InjectModel(ChatReadStatus.name)
    private readonly lastSeenModel: Model<LastSeenDocument>,
  ) {}
  async create(createMessageDto: CreateMessageDto) {
    const result = await this.messagesModel.create(createMessageDto);
    return result;
  }

  async findMessages(chatId: string) {
    const result = await this.messagesModel
      .find({ chatId })
      .sort({ _id: -1 })
      .limit(20);
    return result;
  }
  async findMessage(id: string) {
    const result = await this.messagesModel.findOne({ _id: id });

    return result;
  }

  async update(updateMessageDto: UpdateMessageDto) {
    const { messageId, userId, content } = updateMessageDto;
    const result = await this.messagesModel.findOneAndUpdate(
      { _id: messageId, senderId: userId },
      { content },
    );
    return result;
  }

  async remove({ messageId, userId }: { messageId: string; userId: string }) {
    const result = await this.messagesModel.findOneAndDelete({
      _id: messageId,
      senderId: userId,
    });

    return result;
  }
  async addOrUpdateReaction(reactionDto: {
    messageId: string;
    userId: string;
    emoji: string;
  }) {
    const { messageId, userId, emoji } = reactionDto;

    // Try to update existing reaction
    const updated = await this.messagesModel.findOneAndUpdate(
      { _id: messageId, "reactions.userId": userId },
      {
        $set: {
          "reactions.$.emoji": emoji,
        },
      },
      { new: true },
    );

    if (updated) return updated;

    // If not found, push new reaction
    const added = await this.messagesModel.findByIdAndUpdate(
      messageId,
      {
        $push: {
          reactions: { userId, emoji },
        },
      },
      { new: true },
    );

    return added;
  }
  async deleteReaction(reactionDto: { messageId: string; userId: string }) {
    const { messageId, userId } = reactionDto;

    const result = await this.messagesModel.findByIdAndUpdate(
      messageId,
      {
        $pull: {
          reactions: { userId },
        },
      },
      { new: true },
    );

    return result;
  }
  async updateLastSeen({ userId, chatId }) {
    const result = await this.lastSeenModel.findOneAndUpdate(
      { userId, chatId },
      { lastSeenAt: new Date() },
      { new: true },
    );
    return result;
  }
}

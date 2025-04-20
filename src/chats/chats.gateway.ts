import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from "@nestjs/websockets";
import { ChatsService } from "./chats.service";
import { CreateChatDto } from "./dto/create-chat.dto";
import { Server, Socket } from "socket.io";
import { MessagesService } from "src/messages/messages.service";

@WebSocketGateway()
export class ChatsGateway {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messageService: MessagesService,
  ) {}

  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // userId -> socketId

  // chats events

  @SubscribeMessage("createChat")
  create(@MessageBody() createChatDto: CreateChatDto) {
    return this.chatsService.create(createChatDto);
  }

  @SubscribeMessage("fetchAllChats")
  findAll(client: Socket) {
    const userId = client.handshake.query.userId as string;
    const chats = this.chatsService.findAll(userId);
    client.emit("getAllChats", chats);
  }

  //messages events
  @SubscribeMessage("sendMessage")
  async handleMessage(client: Socket, payload: any) {
    const { recipientId, chatId, content, attachment } = payload;
    const senderId = client.handshake.query.userId as string;

    try {
      // Always save message to database first
      const savedMessage = await this.messageService.create({
        chatId,
        senderId,
        content,
        attachment,
      });

      // Send confirmation to sender
      client.emit("messageSent", savedMessage);

      // Attempt real-time delivery if recipient is online
      const recipientSocketId = this.connectedUsers.get(recipientId);
      if (recipientSocketId) {
        this.server.to(recipientSocketId).emit("newMessage", savedMessage);
      }

      return;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage("editMessage")
  async handleEditMessage(client: Socket, payload: any) {
    const { messageId, content, recipientId } = payload;
    const userId = client.handshake.query.userId as string;

    try {
      // Update in database
      const updatedMessage = await this.messageService.update({
        messageId,
        userId,
        content,
      });

      // Send confirmation to sender
      client.emit("messageEdited", updatedMessage);

      // Notify recipient if online
      const recipientSocketId = this.connectedUsers.get(recipientId);
      if (recipientSocketId) {
        this.server.to(recipientSocketId).emit("messageEdited", updatedMessage);
      }

      return { success: true, message: updatedMessage };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage("deleteMessage")
  async handleDeleteMessage(client: Socket, payload: any) {
    const { messageId, recipientId } = payload;
    const userId = client.handshake.query.userId as string;

    try {
      // Check if message exists and belongs to the user
      const message = await this.messageService.findMessage(messageId);

      if (!message) {
        throw new Error("Message not found");
      }

      if (message?.senderId.toString() !== userId) {
        throw new Error("Cannot delete message from another user");
      }

      if (message?.isDeleted) {
        // Message already deleted, just confirm to client
        client.emit("messageDeleted", { messageId });
        return { success: true };
      }

      // Check time constraint (5 minutes)
      // const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      // if (message.createdAt < fiveMinutesAgo) {
      //   throw new Error('Cannot delete messages older than 5 minutes');
      // }

      // Delete files if any
      // if (message.attachments?.length > 0) {
      //   for (const attachment of message.attachments) {
      //     await this.fileService.deleteFile(attachment.fileId);
      //   }
      // }

      // Update in database (soft delete)
      await this.messageService.remove({ messageId, userId });

      // Send confirmation to sender
      client.emit("messageDeleted", { messageId });

      // Notify recipient if online
      const recipientSocketId = this.connectedUsers.get(recipientId);
      if (recipientSocketId) {
        this.server.to(recipientSocketId).emit("messageDeleted", { messageId });
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage("addReaction")
  async handleReaction(client: Socket, payload: any) {
    const { messageId, emoji, recipientId } = payload;
    const userId = client.handshake.query.userId as string;

    try {
      // Save reaction to database
      await this.messageService.addOrUpdateReaction({
        messageId,
        userId,
        emoji,
      });

      // Send confirmation to sender
      client.emit("messageReaction", {
        messageId,
        userId,
        emoji,
      });

      // Notify recipient if online
      const recipientSocketId = this.connectedUsers.get(recipientId);
      if (recipientSocketId) {
        this.server.to(recipientSocketId).emit("messageReaction", {
          messageId,
          userId,
          emoji,
        });
      }

      return;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  //last seen events
  @SubscribeMessage("lastSeen")
  async handleLeaveChat(client: Socket, payload: any) {
    const { chatId } = payload;
    const userId = client.handshake.query.userId as string;

    try {
      // Update last seen timestamp in chat
      await this.messageService.updateLastSeen({ chatId, userId });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

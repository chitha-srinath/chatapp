import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

// message.schema.ts

export class Attachment {
  @Prop()
  fileId: Types.ObjectId;

  @Prop()
  fileName: string;

  @Prop()
  fileType: string;

  @Prop()
  fileSize: number;

  @Prop()
  filePath: string;
}

export class Reaction {
  @Prop({ type: Types.ObjectId, ref: "User" })
  userId: Types.ObjectId;

  @Prop()
  emoji: string;
}

@Schema({ timestamps: true })
export class Messages extends Document {
  @Prop({ type: Types.ObjectId, ref: "Chats" })
  chatId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User" })
  senderId: Types.ObjectId;

  @Prop()
  content: string;

  @Prop([Attachment])
  attachments: Attachment[];

  @Prop([Reaction])
  reactions: Reaction[];

  @Prop({ default: false })
  isEdited: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isReply: boolean;

  @Prop({ type: Types.ObjectId, ref: "Messages" })
  replyTo: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Messages);
export type MessagesDocument = Messages & Document;

// chat-read-status.schema.ts

@Schema()
export class ChatReadStatus extends Document {
  @Prop({ type: Types.ObjectId, ref: "Chat" })
  chatId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User" })
  userId: Types.ObjectId;

  @Prop()
  lastSeenAt: Date;
}

export const ChatReadStatusSchema =
  SchemaFactory.createForClass(ChatReadStatus);
export type LastSeenDocument = ChatReadStatus & Document;

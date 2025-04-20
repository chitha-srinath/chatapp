import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ChatsListDocument = ChatsList & Document; // Assuming you have a Document interface defined somewhere

@Schema({ timestamps: true })
export class ChatsList extends Document {
  @Prop({ type: [{ type: Types.ObjectId, ref: "User" }] })
  participants: Types.ObjectId[];

  @Prop({ required: true })
  chatId: string;

  @Prop({ type: Types.ObjectId, ref: "Message" })
  lastMessage: Types.ObjectId;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ChatsSchema = SchemaFactory.createForClass(ChatsList);

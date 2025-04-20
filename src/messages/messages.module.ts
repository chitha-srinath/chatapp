import { Module } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { MessagesController } from "./messages.controller";
import {
  ChatReadStatus,
  ChatReadStatusSchema,
  Messages,
  MessageSchema,
} from "./schema/message.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  controllers: [MessagesController],
  imports: [
    MongooseModule.forFeature([
      { name: Messages.name, schema: MessageSchema }, // Register the Message schema with Mongoose
      { name: ChatReadStatus.name, schema: ChatReadStatusSchema },
    ]),
  ],
  providers: [MessagesService],
  exports: [MessagesService], // Export MessagesService to be used in other modules
})
export class MessagesModule {}

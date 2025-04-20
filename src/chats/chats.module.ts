import { Module } from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { ChatsGateway } from "./chats.gateway";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatsList, ChatsSchema } from "./schema/chats.schema";
import { MessagesModule } from "src/messages/messages.module";

@Module({
  providers: [ChatsGateway, ChatsService],
  imports: [
    MessagesModule,
    MongooseModule.forFeature([{ name: ChatsList.name, schema: ChatsSchema }]),
  ],
})
export class ChatsModule {}

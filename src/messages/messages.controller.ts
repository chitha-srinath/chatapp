import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { ApiBody } from "@nestjs/swagger";

@Controller("messages")
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiBody({
    type: CreateMessageDto,
    description: "Create a new message",
  })
  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.messagesService.findMessages(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(updateMessageDto);
  }

  @Delete(":id")
  remove(
    @Param("id") id: string,
    @Body() DeleteMessageDto: { userId: string; messageId: string },
  ) {
    return this.messagesService.remove(DeleteMessageDto);
  }
}


import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(":id")
  findOne(@Param("id") userId: string) {
    return this.usersService.findOne(userId);
  }
}

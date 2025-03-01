import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUser } from "./users.interface";
import { User } from "./users.entity";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  async createUser(@Body() body: CreateUser): Promise<User> {
    return await this.usersService.createUser(body);
  }
}

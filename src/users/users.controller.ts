import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUser } from "./users.interface";
import { Response } from "express";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  async createUser(@Body() body: CreateUser, @Res() res: Response): Promise<Response> {
    const user = await this.usersService.createUser(body);
    return res.status(HttpStatus.CREATED).json({
      message: "User created successfully",
      data: user,
    });
  }

  @Post("login")
  async login(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ): Promise<Response> {
    const loggedinUser = await this.usersService.loginUserWithEmail(body.email, body.password);
    res.cookie("access_token", loggedinUser.token.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 1000,
    });
    res.cookie("refresh_token", loggedinUser.token.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(HttpStatus.OK).json({
      message: "User logged in successfully",
      data: loggedinUser.user,
    });
  }
}

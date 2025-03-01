import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import { CreateUser } from "./users.interface";

@Injectable()
export class UsersService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async createUser(user_data: CreateUser): Promise<User> {
    const user_with_email = await this.usersRepository.findOne({
      where: { email: user_data.email },
    });

    if (user_with_email) {
      throw new BadRequestException("Email already exists");
    }

    const user = new User();
    Object.assign(user, user_data);
    return await this.usersRepository.save(user);
  }

  async loginUserWithEmail(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new BadRequestException("User not found");
    }

    if (user.password !== password) {
      throw new BadRequestException("Invalid password");
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Repository } from "typeorm";
import { CreateUser } from "./users.interface";
import { CryptoService } from "src/shared/lib/utility";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UsersService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
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
      where: { email },
    });

    if (!user) {
      throw new BadRequestException("User not found");
    }

    if (!CryptoService.comparePassword(password, user.password)) {
      throw new BadRequestException("Invalid email or password");
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
      expiresIn: "15m",
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
      expiresIn: "7d",
    });
    return {
      user: user,
      token: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    };
  }
}

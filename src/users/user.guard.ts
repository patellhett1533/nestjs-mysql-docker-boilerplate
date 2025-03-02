import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const cookies = request.cookies;

    const accessToken = cookies?.access_token;
    const refreshToken = cookies?.refresh_token;

    if (!accessToken && !refreshToken) {
      return false;
    }

    if (!accessToken && refreshToken) {
      const user = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { iat, exp, ...rest } = user;
      const newAccessToken = this.jwtService.sign(rest, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: "15m",
      });
      const newRefreshToken = this.jwtService.sign(rest, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: "7d",
      });

      request.res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 2 * 60 * 1000,
      });
      request.res.cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      request.user = user;
      return true;
    }

    const payload = this.jwtService.verify(accessToken, {
      secret: process.env.ACCESS_TOKEN_SECRET,
    });

    request.user = payload;
    return true;
  }
}

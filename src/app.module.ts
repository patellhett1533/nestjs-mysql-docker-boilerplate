import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import config from "./shared/config/db.config";
import { AppLogger } from "./app.logger";
import { UsersModule } from "./users/users.module";
import { TokenModule } from './token/token.module';

@Module({
  imports: [TypeOrmModule.forRoot(config as TypeOrmModuleOptions), UsersModule, TokenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLogger).forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}

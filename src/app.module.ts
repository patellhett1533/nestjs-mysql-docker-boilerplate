import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import config from 'lib/db.config';
import { AppLogger } from './app.logger';

@Module({
  imports: [TypeOrmModule.forRoot(config as TypeOrmModuleOptions)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AppLogger)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

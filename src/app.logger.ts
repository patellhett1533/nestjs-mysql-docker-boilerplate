/*
Nest js log all including http requests with method original url status code content length and response time and ip address
*/

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AppLogger implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const startAt = process.hrtime();
    const { ip, method, originalUrl } = request;

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const diff = process.hrtime(startAt);
      //response time in milliseconds with 2 decimal places
      const responseTime =
        Math.round(((diff[0] * 1e9 + diff[1]) / 1e6) * 100) / 100;
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${responseTime}ms ${contentLength} ${ip}`,
      );
    });

    next();
  }
}

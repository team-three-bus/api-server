import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { Request } from 'request-ip';
import LoggingService from '../services/logging';
import { loggingParams } from '../interface/params';


@Controller('logging')
export default class LoggingController {
  constructor(
    private readonly loggingService: LoggingService,
  ) {
  }

  @Post('/')
  async getPosts(@Body() logging:loggingParams, @Req() req: Request, @Res() res: Response) {

    const response = await this.loggingService.putDocument(req, logging.userId, logging.name, logging.id, logging.price);
    if(response === undefined) {
      res.status(400)
    } else if(response === 200) {
      res.status(200).json({ message: "로깅 성공" })
    }
  }
}
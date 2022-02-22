import { Body, Controller, Get, Post, Query, Req, Res } from "@nestjs/common";
import { Response } from "express";
import LoggingService from "../services/logging";
import { loggingParams } from "../interface/params";


@Controller("logging")
export default class LoggingController {
  constructor(
    private readonly loggingService: LoggingService
  ) {
  }

  @Post("/")
  async getPosts(@Body() logging: loggingParams, @Res() res: Response) {

    const response = await this.loggingService.putDocument(logging.userId, logging.name, logging.id, logging.price);
    if (response === 200) {
      res.status(200).json({ message: "로깅 성공" });
    } else {
      res.status(500).json({ message: "로깅 실패" });
    }
  }
}
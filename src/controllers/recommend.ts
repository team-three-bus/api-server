import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from "express";
import PostsSearchService from "../services/search";
import { integer } from "@elastic/elasticsearch/api/types";
import RecommendService from '../services/recommend';
import { getUserIdDto } from '../dto/userId';


@Controller("recommend")
export default class RecommendController {
  constructor(
    private readonly recommendService: RecommendService
  ) {
  }

  @Get("/")
  async getRecommendProduct(@Query("userId") userId, @Res() res: Response) {

    let recommendProduct = this.recommendService.getRecommendProduct(userId);
  }
}
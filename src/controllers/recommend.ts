import { Controller, Get, Query, Res } from "@nestjs/common";
import { Response } from "express";
import RecommendService from "../services/recommend";


@Controller("recommend")
export default class RecommendController {
  constructor(
    private readonly recommendService: RecommendService
  ) {
  }

  @Get("/")
  async getRecommendProduct(@Query("userId") userId: number, @Query("size") size: number, @Res() res: Response) {
    const recommendProduct = await this.recommendService.getRecommendProduct(userId, size);
    if(recommendProduct) {
      return res.status(200).json(recommendProduct);
    } else {
      const defaultProduct = await this.recommendService.defaultRecommendProduct();
      return res.status(200).json(defaultProduct);;
    }
  }
}
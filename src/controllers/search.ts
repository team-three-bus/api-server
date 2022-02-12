import { Controller, Get, Query, Res } from "@nestjs/common";
import { Response } from "express";
import PostsSearchService from "../services/search";
import { integer } from "@elastic/elasticsearch/api/types";


@Controller("elastic")
export default class PostsController {
  constructor(
    private readonly postsService: PostsSearchService
  ) {
  }

  @Get("/")
  async getPosts(@Query("search") text: string, @Query("pageSize") pageSize: integer, @Query("currentPage") currentPage: integer,
                 @Query("brand") brand: string,@Query("eventtype") eventtype: string,@Query("category") category: string,
                 @Query("sort") sort: string, @Res() res: Response) {
    if (text) {
      const searchResult = await this.postsService.search(text, pageSize, currentPage,brand,eventtype,category,sort);
      if (searchResult !== "") {
        return res.status(200).json(searchResult);
      } else {
        return res.status(401).json({ message: "앗! 아쉽게도 검색된 상품이 없습니다. 현재 할인중인 상품이 아닐 경우 검색이 지원되지 않으니 참고바랍니다." });
      }
    } else {
      return res.status(401).json({ message: "앗! 아쉽게도 검색된 상품이 없습니다. 현재 할인중인 상품이 아닐 경우 검색이 지원되지 않으니 참고바랍니다." });
    }
  }
}
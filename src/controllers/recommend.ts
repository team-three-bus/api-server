import { Controller, Get, Headers, Query, Res } from "@nestjs/common";
import { Response } from "express";
import RecommendService from "../services/recommend";
import { decodeJWT } from "../utils/jwt";
import { UsersService } from "../services/users";
import { LikeService } from "../services/like";


@Controller("recommend")
export default class RecommendController {
  constructor(
    private readonly recommendService: RecommendService,
    private readonly usersService: UsersService,
    private readonly likeService: LikeService
  ) {
  }

  @Get("/")
  async getRecommendProduct(@Headers() headers, @Query("size") size: number, @Res() res: Response) {

    if (headers.authorization) {
      const userTokenPayload = decodeJWT(headers.authorization);
      if (!userTokenPayload) {
        res.status(401).json({ message: "재 로그인이 필요합니다." });
      }
      const user = await this.usersService.getUser(userTokenPayload.socialId);
      if(user) {
        const likeList = await this.likeService.likeList(user.id);
        const clickProducts = await this.recommendService.getUserClickProducts(user.id);

        if(likeList.length === 0 && clickProducts.length === 0) {
          // 한번도 클릭과 찜을 안한 유저이기에 디폴트로 추천해준다
          const defaultProduct = await this.recommendService.defaultRecommendProduct();
          return res.status(200).json(defaultProduct);
        } else {
          const products = await this.recommendService.extractProducts(likeList, clickProducts, user.id);
          const recommendProducts = await this.recommendService.matchProduct(products);
          recommendProducts["isDefault"] = "no";
          recommendProducts["matchProducts"] = [...products];
          return res.status(200).json(recommendProducts);
        }
      }
    } else {
      // 로그인을 안한 유저
      const defaultProduct = await this.recommendService.defaultRecommendProduct();
      defaultProduct["isDefault"] = "yes";
      return res.status(200).json(defaultProduct);
    }


    // const recommendProduct = await this.recommendService.getRecommendProduct(userId, size);
    // if (recommendProduct) {
    //   return res.status(200).json(recommendProduct);
    // } else {
    //   const defaultProduct = await this.recommendService.defaultRecommendProduct();
    //   return res.status(200).json(defaultProduct);
    // }
  }
}
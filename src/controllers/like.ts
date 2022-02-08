import { Controller, Get, Headers, Res, Query} from '@nestjs/common';
import { LikeService } from '../services/like';
import { UsersService } from '../services/users';
import { decodeJWT } from '../utils/jwt';
import { Response } from 'express';
import { InqueryCondition } from 'src/types/products.category.condition';

@Controller('like')
export class LikeController {
  public constructor(
    private readonly likeService: LikeService,
    private readonly usersService: UsersService
  ) {}

  @Get('/')
  public async getLikeList(
    @Headers() headers, 
    @Query('category') category,
    @Query('brand') brand,
    @Query('event') event,
    @Res() res: Response
  ) {
    if (!headers.authorization) {
      res.status(401).json({message: "토큰을 첨부해주세요."});
    }
    const userTokenPayload = decodeJWT(headers.authorization);  
    if (!userTokenPayload) {
      res.status(401).json({message: "재 로그인이 필요합니다."});
    }
    const user = await this.usersService.getUser(userTokenPayload.socialId);
    let likeList;
    if (category || brand || event) {
      const categoryCondition: InqueryCondition['CATEGORY'] = 
        (category) ? 
        category.split(',') : 
        ['간편식사', '빵/과자류', '생수/과채/기타음료', '탄산음료', '유제품/커피 음료',
        '아이스크림', '생활용품', '기타'];
      const brandCondition: InqueryCondition['BRAND'] = (brand) ? brand.split(',') : ['GS', 'CU', '7-ELEVEN', 'emart24'];
      likeList = await this.likeService.likeListForCondition(
        user.id,
        brandCondition,
        categoryCondition,
        event
      );
    } else {
      likeList = await this.likeService.likeList(user.id);
    }
    
    res.json({
      list: likeList
    });
  }
}
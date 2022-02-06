import { Controller, Get, Post, Body, Headers, Res, HttpStatus, Query, Delete} from '@nestjs/common';
import { ProductsService } from '../services/products';
import { UsersService } from '../services/users';
import { InqueryCondition } from '../types/products.category.condition';
import { decodeJWT } from '../utils/jwt';
import { Response } from 'express';

@Controller('products')
export class ProductsController {
  public constructor(
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService
  ) {}

  @Get('/')
  public async getProduct(@Query('id') id) {
    const product = await this.productsService.viewProductId(id);

    return {
      product: product
    }
  }

  @Get('/main/popular')
  public async getPopularProductList(
    @Query('page') page,
    @Query('category') category,
    @Res() res: Response
  ) {
    const pageNum = (page) ? page : 1;
    if (pageNum > 6) {
      return res.status(400).json({
        page: page,
        list: []
      });
    }
    const productList = await this.productsService.popularProductList(Number(page), category);

    return res.json({
      page: page,
      list: productList
    });
  };

  @Get('/category')
  public async getCategory(
    @Query('category') category, 
    @Query('page') page,
    @Query('brand') brand,
    @Query('order') order,
    @Query('event') event,
  ): Promise<any> {
    const pageNum = (page) ? page : 1;
    const categoryCondition: InqueryCondition['CATEGORY'] = 
      (category) ? 
      category.split(',') : 
      ['간편식사', '빵/과자류', '생수/과채/기타음료', '탄산음료', '유제품/커피 음료',
      '아이스크림', '생활용품', '기타'];
    // default: 4개 브랜드 적용될 수 있도록 구현
    const brandCondition: InqueryCondition['BRAND'] = (brand) ? brand.split(',') : ['GS', 'CU', '7-ELEVEN', 'emart24'];
    const orderCondition: InqueryCondition['ORDER'] = (order) ? order : 'lowPrice';
    const eventCondition: InqueryCondition['event'] = (event) ? event.split(',') : ['1+1', '2+1'];

    return await this.productsService.inCategoryProduct(categoryCondition, pageNum, brandCondition, orderCondition, eventCondition);
  }

  @Post('/like')
  public async likeProduct(
    @Headers() headers, 
    @Body() likeData,
    @Res() res: Response
  ) {
    // TODO middleware 분리 필요
    if (!headers.authorization) {
      res.status(401).json({message: "토큰을 첨부해주세요."});
    }
    const userTokenPayload = decodeJWT(headers.authorization);  
    if (!userTokenPayload) {
      res.status(401).json({message: "재 로그인이 필요합니다."});
    }
    const user = await this.usersService.getUser(userTokenPayload.socialId);
    const isLike = await this.productsService.likeProduct(likeData.productId, user);
    if (isLike === 'NOT') {
      res.status(400).json({message: "없는 상품입니다."});
    }
    res.json({
      message: "찜 완료되었습니다."
    });
  }

  @Delete('/like')
  public async unlikeProduct(
    @Headers() headers, 
    @Body() likeData,
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
    const deleteLike = await this.productsService.unLikeProduct(
      likeData.productId, user.id
    );

    if (deleteLike === 'NOT') {
      res.status(400).json({message: "없는 상품입니다."});
    }
    res.json({
      message: "찜 삭제 되었습니다."
    });
  }

}
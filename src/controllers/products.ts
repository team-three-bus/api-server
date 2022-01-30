import { Controller, Get, Post, Body, Headers, Res, HttpStatus, Query} from '@nestjs/common';
import { ProductsService } from '../services/products';
import { InqueryCondition } from '../types/products.category.condition';

@Controller('products')
export class ProductsController {
  public constructor(private readonly productsService: ProductsService) {}

  @Get('/')
  public async getProduct(@Query('id') id) {
    const product = await this.productsService.viewProductId(id);

    return {
      product: product
    }
  }

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
    const brandCondition: InqueryCondition['BRAND'] = (brand) ? brand.split(',') : ['GS', 'CU'];
    const orderCondition: InqueryCondition['ORDER'] = (order) ? order : 'lowPrice';
    const eventCondition: InqueryCondition['event'] = (event) ? event.split(',') : ['1+1', '2+1'];

    return await this.productsService.inCategoryProduct(categoryCondition, pageNum, brandCondition, orderCondition, eventCondition);
  }
}
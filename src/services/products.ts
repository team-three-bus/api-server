import { Injectable } from '@nestjs/common';
import { ProductsDao } from '../dao/products';
import { EventsDao } from '../dao/events';
import { OrderType } from '../types/products.category.condition';

const PRODUCT_LIMIT = 10;

@Injectable()
export class ProductsService {
  public constructor(
    private productsDao: ProductsDao,
    private eventsDao: EventsDao
  ) {}

  public async viewProductId (id: number): Promise<any> {
    const product = await this.productsDao.getProduct(id);

    return product;
  }

  public async inCategoryProduct (
    category: string, 
    page: number,
    brand: string[],
    order: string,
    event: string[]
  ): Promise<any> {
    // @TODO 현재 개발을 위헤 year, month를 부여하였지만, 변경 필요 
    const year = "2022";
    const month = "1";
    const goingEventList = await this.eventsDao.getGoingEventIdList(year, month, event);
    
    const eventIdList = goingEventList.map((x) => x.productId);

    const orderOrderBy = this.orderCondition(order);
    const [productList, count] = await this.productsDao.getCategoryProduct(
      category, page, brand, orderOrderBy.key, orderOrderBy.condition, eventIdList
      );
    const pageSize = Math.ceil(count / PRODUCT_LIMIT);
    
    return {
      pageSize: pageSize,
      currentPage: page,
      list: productList
    };
  }

  public orderCondition (order: string): OrderType {
    if (order === 'lowPrice') {
      return {
        'key': 'product.price',
        'condition' : 'ASC'
      };
    } else if (order === 'highPrice') {
      return {
        'key': 'product.price',
        'condition' : 'DESC'
      };
    } else if (order === 'popularity') {
      return {
        'key': 'product.likeCnt',
        'condition' : 'DESC'
      };
    } else {
      return {
        'key': 'product.viewCnt',
        'condition' : 'DESC'
      };
    }
  }
}
import { Injectable } from '@nestjs/common';
import { ProductsDao } from '../dao/products';
import { EventsDao } from '../dao/events';
import { LikeDao } from '../dao/like';
import { UsersEntity } from '../entitys/users';
import { OrderType } from '../types/products.category.condition';

const PRODUCT_LIMIT = 10;

@Injectable()
export class ProductsService {
  public constructor(
    private productsDao: ProductsDao,
    private eventsDao: EventsDao,
    private likeDao: LikeDao
  ) {}

  public async viewProductId (id: number): Promise<any> {
    const product = await this.productsDao.getProduct(id);
    await this.productsDao.upViewCnt(id, product.viewCnt + 1);
    product.viewCnt = product.viewCnt + 1;
    return product;
  }

  public async popularProductList (
    page: number,
    category: string | undefined,
    userId?: number
  ) {
    let likeProductList: number[] = [];
    if (userId) {
      const likeProducts = await this.likeDao.likeListProduct(userId);
      likeProductList = likeProducts.map((x) => x.productId);
    }

    const productList = await this.productsDao.getPopularProduct(category, page);
    productList.forEach(x => {
      let isLike = false;
      if (likeProductList.includes(x.id)) {
        isLike = true;
      }
      x["isLike"] = isLike;
    });
    
    return productList;
  };

  public async inCategoryProduct (
    category: string[], 
    page: number,
    brand: string[],
    order: string,
    event: string[],
    userId?: number
  ): Promise<any> {
    // @TODO 현재 개발을 위헤 year, month를 부여하였지만, 변경 필요 
    const year = "2022";
    const month = "2";
    const goingEventList = await this.eventsDao.getGoingEventIdList(year, month, event);
    
    const eventIdList = goingEventList.map((x) => x.productId);
    let likeProductList: number[] = [];
    if (userId) {
      const likeProducts = await this.likeDao.likeListProduct(userId);
      likeProductList = likeProducts.map((x) => x.productId);
    }
    const orderOrderBy = this.orderCondition(order);
    const [productList, count] = await this.productsDao.getCategoryProduct(
      category, page, brand, orderOrderBy.key, orderOrderBy.condition, eventIdList
      );
    const pageSize = Math.ceil(count / PRODUCT_LIMIT);
    const productDataList = [];
    productList.forEach(x => {
      let isLike = false;
      if (likeProductList.includes(x.id)) {
        isLike = true;
      }
      productDataList.push({
        id: x.id,
        name: x.name,
        brand: x.brand,
        price: x.price,
        category: x.category,
        eventType: x.events[x.events.length-1].eventType,
        isEvent: x.isEvent,
        viewCnt: x.viewCnt,
        likeCnt: x.likeCnt,
        imageUrl: x.imageUrl,
        isLike: isLike
      })
    });
    
    return {
      pageSize: pageSize,
      productCnt: count,
      currentPage: page,
      list: productDataList
    };
  }

  public async likeProduct(productId: number, user: UsersEntity) {
    // product 있는지 조회 
    const product = await this.productsDao.getOnlyProductData(productId);
    if (!product) {
      return "NOT";
    }
    await Promise.all([
      this.likeDao.likeProduct(productId, user),
      this.productsDao.updateProductLikeCnt(product.id, product.likeCnt+1)
    ]);

    return "SUCCESS";
  }

  public async unLikeProduct(productId: number, userId: number) {
    // product 있는지 조회 
    const product = await this.productsDao.getOnlyProductData(productId);
    if (!product) {
      return "NOT";
    }
    const likeCnt = (product.likeCnt === 0) ? 0 : product.likeCnt - 1;
    
    await Promise.all([
      this.likeDao.unLikeProduct(productId, userId),
      this.productsDao.updateProductLikeCnt(product.id, likeCnt)
    ]);
    return "SUCCESS";
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
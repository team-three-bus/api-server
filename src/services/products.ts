import { Injectable } from '@nestjs/common';
import { ProductsDao } from '../dao/products';
import { EventsDao } from '../dao/events';
import { LikeDao } from '../dao/like';
import { ProductAttrDao } from '../dao/productAttr';
import { UsersEntity } from '../entitys/users';
import { OrderType } from '../types/products.category.condition';
import { ProductsEntity } from 'src/entitys/products';

const PRODUCT_LIMIT = 10;

@Injectable()
export class ProductsService {
  public constructor(
    private productsDao: ProductsDao,
    private eventsDao: EventsDao,
    private likeDao: LikeDao,
    private productAttrDao: ProductAttrDao,
  ) {}

  public async viewProductId(id: number, userId?: number): Promise<any> {
    const product = await this.productsDao.getProduct(id);
    product.events = product.events.reverse().slice(0, 3);
    await this.productsDao.upViewCnt(id, product.viewCnt + 1);
    product.viewCnt = product.viewCnt + 1;
    let isLike = false;
    if (userId) {
      if (await this.likeDao.checkLikeProduct(product.id, userId)) {
        isLike = true;
      }
    }
    product['isLike'] = isLike;
    return product;
  }

  public async getSameProduct(
    id: number,
    category: string,
    userId?: number,
  ): Promise<any> {
    let likeProductList: number[] = [];
    if (userId) {
      const likeProducts = await this.likeDao.likeListProduct(userId);
      likeProductList = likeProducts.map((x) => x.productId);
    }
    const productAttr = await this.productAttrDao.getProductAttr(id);
    const productAttrList = await this.productAttrDao.getProductIdByAttr(
      productAttr.firstAttr,
    );

    const productIdList = productAttrList.map((x) => parseInt(x.productId));
    const sameProductList = await this.productsDao.getSameProducts(
      productIdList,
      category,
    );
    sameProductList.forEach((x) => {
      let isLike = false;
      if (likeProductList.includes(x.id)) {
        isLike = true;
      }
      x['isLike'] = isLike;
      x['eventType'] = x.lastEventType;
    });
    return sameProductList;
  }

  public async popularProductList(
    page: number,
    category: string | undefined,
    userId?: number,
  ) {
    let likeProductList: number[] = [];
    if (userId) {
      const likeProducts = await this.likeDao.likeListProduct(userId);
      likeProductList = likeProducts.map((x) => x.productId);
    }

    const productList = await this.productsDao.getPopularProduct(
      category,
      page,
    );
    productList.forEach(x => {
      let isLike = false;
      if (likeProductList.includes(x.id)) {
        isLike = true;
      }
      x['isLike'] = isLike;
      x['eventType'] = x.lastEventType;
    });

    return productList;
  }

  public async inCategoryProduct(
    category: string[],
    page: number,
    getPageSize: number,
    brand: string[],
    order: string,
    event: string[],
    userId?: number,
  ): Promise<any> {
    // @TODO ?????? ????????? ?????? year, month??? ??????????????????, ?????? ?????? 
    
    let likeProductList: number[] = [];
    if (userId) {
      const likeProducts = await this.likeDao.likeListProduct(userId);
      likeProductList = likeProducts.map((x) => x.productId);
    }
    const orderOrderBy = this.orderCondition(order);
    const [productList, count] = await this.productsDao.getCategoryProduct(
      category, page, getPageSize, brand, event, orderOrderBy.key, orderOrderBy.condition
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
        eventType: x.lastEventType,
        isEvent: x.isEvent,
        viewCnt: x.viewCnt,
        likeCnt: x.likeCnt,
        imageUrl: x.imageUrl,
        isLike: isLike
      })
    });
    
    return {
      productCnt: count,
      currentPage: page,
      list: productDataList
    };
  }

  public async likeProduct(productId: number, user: UsersEntity) {
    // product ????????? ?????? 
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
    // product ????????? ?????? 
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
        'key': 'product.viewCnt',
        'condition' : 'DESC'
      };
    } else {
      return {
        'key': 'product.likeCnt',
        'condition' : 'DESC'
      };
    }
  }
}
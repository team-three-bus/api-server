import { Injectable } from '@nestjs/common';
import { LikeDao } from '../dao/like';
import { ProductsDao } from '../dao/products';


@Injectable()
export class LikeService {
  public constructor(
    private likeDao: LikeDao,
    private productsDao: ProductsDao
  ) {}

  public async getProductListForLike(userId): Promise<number[]> {
    const likesProduct = await this.likeDao.likeListProduct(userId);
    const likeProductIdList = likesProduct.map((x) => x.productId);

    return likeProductIdList;
  }

  public async likeList(userId: number) {
    const likeProductIdList = await this.getProductListForLike(userId);
    
    const productList = await this.productsDao.getProducts(likeProductIdList);
    
    return productList;
  }

  public async likeListForCondition(
    userId: number,
    brand: string[],
    category: string[],
    event?: string
  ) {
    const likeProductIdList = await this.getProductListForLike(userId);
    const isEvent = (!event) ? 
      null :
      (event === "true") ? 
        true :
        null;

    return await this.productsDao.getLikeProducts(
      likeProductIdList,
      brand,
      category,
      isEvent
    );
  }
}



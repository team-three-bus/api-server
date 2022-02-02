import { Injectable } from '@nestjs/common';
import { LikeDao } from '../dao/like';
import { ProductsDao } from '../dao/products';


@Injectable()
export class LikeService {
  public constructor(
    private likeDao: LikeDao,
    private productsDao: ProductsDao
  ) {}

  public async likeList(userId: number) {
    const likesProduct = await this.likeDao.likeListProduct(userId);
    const likeProductIdList = likesProduct.map((x) => x.productId);
    
    const productList = await this.productsDao.getProducts(likeProductIdList);
    
    return productList;
  }
}



import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductsEntity } from '../entitys/products';
import { EventsEntity } from '../entitys/events';

const PRODUCT_LIMIT = 10;

@Injectable()
export class ProductsDao {
  constructor(
    @InjectRepository(ProductsEntity)
    private productsRepository: Repository<ProductsEntity>,
  ) {}

  public getAllProductCnt(): Promise<number> {
    return this.productsRepository.count();
  }

  public async getProduct(id: number): Promise<ProductsEntity> {
    return this.productsRepository.findOne({
      where: {
        id: id
      }
    });
  }
  
  public async upViewCnt(id: number, viewCnt: number) {
    this.productsRepository.update({
      id: id
    }, {
      viewCnt: viewCnt
    });
  }

  public async getCategoryProduct(
    category: string[], 
    page: number,
    brand: string[],
    orderKey: string,
    orderCondition: 'ASC' | 'DESC',
    eventIdList: string[]
  ): Promise<[ProductsEntity[], number]> {
    const [list, count] = await this.productsRepository.createQueryBuilder('product')
      .leftJoinAndMapMany(
        'product.events',
        EventsEntity,
        'events',
        'events.productId = product.id',
      )
      .where({
        category: In(category),
        isEvent: true,
        brand: In(brand),
        id: In(eventIdList)
      })
      .take(PRODUCT_LIMIT)
      .skip((page-1) * PRODUCT_LIMIT)
      .orderBy(orderKey, orderCondition)
      .getManyAndCount();

    return [list, count];
  }
}
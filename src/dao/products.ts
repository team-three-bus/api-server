import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductsEntity } from '../entitys/products';
import { EventsEntity } from '../entitys/events';
import { isIn } from 'class-validator';

const PRODUCT_LIMIT = 10;
const POPULAR_PRODUCT_LIMIT = 6;

@Injectable()
export class ProductsDao {
  constructor(
    @InjectRepository(ProductsEntity)
    private productsRepository: Repository<ProductsEntity>,
  ) {}

  public getAllProductCnt(): Promise<number> {
    return this.productsRepository.count();
  }

  public async getOnlyProductData(id: number) {
    return this.productsRepository.findOne({
      where: {
        id: id
      }
    });
  }

  public async updateProductLikeCnt(id: number, likeCnt: number) {
    await this.productsRepository.update({
      id: id
    }, {
      likeCnt: likeCnt
    });
  }

  public async getProduct(id: number): Promise<ProductsEntity> {
    return await this.productsRepository.createQueryBuilder('product')
      .leftJoinAndMapMany(
        'product.events',
        EventsEntity,
        'events',
        'events.productId = product.id',
      )
      .where({
        id: id
      })
      .getOne();
  }

  public async getProducts(id: number[]) {
    return await this.productsRepository.find({
      where: {
        id: In(id)
      }
    })
  }

  public async getLikeProducts(
    id: number[],
    brand: string[],
    category: string[],
    isEvent: Boolean | null
  ) {
    const queryBuilder = this.productsRepository.createQueryBuilder('product');
    queryBuilder.where({
      id: In(id),
      brand: In(brand),
      category: In(category)
    });
    if (!isEvent) {
      queryBuilder.andWhere({
        isEvent: isEvent
      });
    }

    return await queryBuilder.getMany();

  }
  
  public async upViewCnt(id: number, viewCnt: number) {
    this.productsRepository.update({
      id: id
    }, {
      viewCnt: viewCnt
    });
  }

  public async getPopularProduct (
    category: string | undefined,
    page: number
  ) {
    if (!category) {
      return await this.productsRepository.createQueryBuilder('product')
        .leftJoinAndMapMany(
          'product.events',
          EventsEntity,
          'events',
          'events.productId = product.id',
        )
        .where({
          isEvent: true
        })
        .take(POPULAR_PRODUCT_LIMIT)
        .skip((page - 1) * POPULAR_PRODUCT_LIMIT)
        .getMany();
    }
    return await this.productsRepository.createQueryBuilder('product')
      .leftJoinAndMapMany(
        'product.events',
        EventsEntity,
        'events',
        'events.productId = product.id',
      )
      .where({
        isEvent: true,
        category: category
      })
      .take(POPULAR_PRODUCT_LIMIT)
      .skip((page - 1) * POPULAR_PRODUCT_LIMIT)
      .getMany();
  }

  public async getCategoryProduct(
    category: string[], 
    page: number,
    getPageSize: number,
    brand: string[],
    event: string[],
    orderKey: string,
    orderCondition: 'ASC' | 'DESC',
  ): Promise<[ProductsEntity[], number]> {
    const [list, count] = await this.productsRepository.createQueryBuilder('product')
      .where({
        category: In(category),
        isEvent: true,
        brand: In(brand),
        lastEventType: In(event)
      })
      .take(PRODUCT_LIMIT * getPageSize)
      .skip((page-1) * PRODUCT_LIMIT)
      .orderBy(orderKey, orderCondition)
      .getManyAndCount();

    return [list, count];
  }
}
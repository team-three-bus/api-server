import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductAttrEntity } from '../entitys/productAttr';

@Injectable()
export class ProductAttrDao {
  constructor(
    @InjectRepository(ProductAttrEntity)
    private productAttrRepository: Repository<ProductAttrEntity>,
  ) {}

  public getProductAttr(productId: number): Promise<ProductAttrEntity> {
    return this.productAttrRepository.findOne({
      where: {
        productId: productId,
      },
      select: ['productId', 'firstAttr'],
    });
  }

  public getProductIdByAttr(attr: string) {
    return this.productAttrRepository.find({
      where: {
        firstAttr: attr,
      },
      select: ['productId'],
    });
  }
}

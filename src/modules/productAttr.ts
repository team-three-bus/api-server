import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductAttrEntity } from '../entitys/productAttr';

@Module({
  imports: [TypeOrmModule.forFeature([ProductAttrEntity])],
})
export class ProductAttrModule {}

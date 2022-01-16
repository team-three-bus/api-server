import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsEntity } from '../entitys/products';

@Module({
  imports: [TypeOrmModule.forFeature([ProductsEntity])],
})
export class ProductsModule {}

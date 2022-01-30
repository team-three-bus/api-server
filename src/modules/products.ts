import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from '../controllers/products';
import { ProductsEntity } from '../entitys/products';
import { EventsEntity } from '../entitys/events';
import { ProductsService } from '../services/products';
import { ProductsDao } from '../dao/products';
import { EventsDao } from '../dao/events';

@Module({
  imports: [TypeOrmModule.forFeature([ProductsEntity, EventsEntity])],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsDao, EventsDao]
})
export class ProductsModule {}

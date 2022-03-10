import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from '../controllers/products';
import { ProductsEntity } from '../entitys/products';
import { EventsEntity } from '../entitys/events';
import { LikeEntity } from '../entitys/like';
import { UsersEntity } from '../entitys/users';
import { ProductAttrEntity } from '../entitys/productAttr';
import { ProductsService } from '../services/products';
import { UsersService } from '../services/users';
import { ProductsDao } from '../dao/products';
import { EventsDao } from '../dao/events';
import { LikeDao } from '../dao/like';
import { UsersDao } from '../dao/users';
import { ProductAttrDao } from '../dao/productAttr';
import LoggingService from '../services/logging';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import RecommendService from "../services/recommend";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductsEntity,
      EventsEntity,
      LikeEntity,
      UsersEntity,
      ProductAttrEntity,
    ]),
    ElasticsearchModule.register({
    node: 'http://34.64.247.101:9500',
      auth: {
        username: 'elastic',
        password: 'threebus'
      }
  })],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    UsersService,
    LoggingService,
    RecommendService,
    ProductsDao,
    EventsDao,
    LikeDao,
    UsersDao,
    ProductAttrDao,
  ],
})
export class ProductsModule {
}

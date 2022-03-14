import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import RecommendController from '../controllers/recommend';
import RecommendService from '../services/recommend';
import { UsersService } from "../services/users";
import { LikeService } from "../services/like";
import { UsersDao } from "../dao/users";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersEntity } from "../entitys/users";
import { LikeEntity } from "../entitys/like";
import { LikeDao } from "../dao/like";
import { ProductsDao } from "../dao/products";
import { ProductsEntity } from "../entitys/products";

@Module({
  imports: [ElasticsearchModule.register({
    node: 'http://34.64.247.101:9500',
    auth: {
      username: 'elastic',
      password: 'threebus'
    }
  }),
    TypeOrmModule.forFeature([UsersEntity, LikeEntity, ProductsEntity])],
  controllers: [RecommendController],
  providers: [RecommendService, UsersService, UsersDao,LikeService, LikeDao, ProductsDao]
})
export class RecommendModule {}
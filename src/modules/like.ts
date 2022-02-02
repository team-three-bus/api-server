import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeController } from '../controllers/like';
import { LikeEntity } from '../entitys/like';
import { UsersEntity } from '../entitys/users';
import { ProductsEntity } from '../entitys/products';
import { LikeService } from '../services/like';
import { UsersService } from '../services/users';
import { LikeDao } from '../dao/like';
import { UsersDao } from '../dao/users';
import { ProductsDao } from '../dao/products';


@Module({
  imports: [TypeOrmModule.forFeature([LikeEntity, UsersEntity, ProductsEntity])],
  controllers: [LikeController],
  providers: [LikeService, UsersService, LikeDao, UsersDao, ProductsDao]
})
export class LikeModule {}
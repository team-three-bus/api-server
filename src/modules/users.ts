import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '../controllers/users';
import { UsersService } from '../services/users';
import { UsersEntity } from '../entitys/users';
import { UsersDao } from '../dao/users';
import { LikeDao } from '../dao/like';
import { LikeEntity } from '../entitys/like';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, LikeEntity])],
  controllers: [UsersController],
  providers: [UsersService, UsersDao, LikeDao],
})
export class UsersModule {}

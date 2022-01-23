import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from "../controllers/users";
import { UsersService } from '../services/users';
import { UsersEntity } from '../entitys/users';
import { UsersDao } from '../dao/users';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [UsersController],
  providers: [UsersService, UsersDao],
})
export class UsersModule {}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { LikeEntity } from '../entitys/like';
import { UsersEntity } from '../entitys/users';

@Injectable()
export class LikeDao {
  constructor(
    @InjectRepository(LikeEntity)
    private likeRepository: Repository<LikeEntity>,
  ) {}

  public async likeProduct(productId: number, user: UsersEntity) {
    await this.likeRepository.insert({
      productId: productId,
      userId: user.id,
      users: user
    })
  }

  public async unLikeProduct(productId: number, userId: number) {
    await this.likeRepository.delete({
      productId: productId,
      userId: userId
    });
  }

  public async likeListProduct(userId: number) {
    return await this.likeRepository.find({
      where: {
        userId: userId
      },
      select: ['productId'],
      order: {
        createdAt: "DESC"
      }
    });
  }
}
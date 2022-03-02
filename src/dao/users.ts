import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entitys/users';
import { AddUsersDto } from '../dto/users';


@Injectable()
export class UsersDao {
  constructor (
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
  ) {}


  public async getUser(socialId: string): Promise<UsersEntity> {
    return await this.userRepository.findOne({
      where: {
        socialId: socialId
      }
    });
  }

  public async addUser(addUser: AddUsersDto) {
    await this.userRepository.save(addUser);
  }

  public async updateUserName(socialId: string, name: string) {
    await this.userRepository.update({
      socialId: socialId
    }, {
      nickname: name
    });
  }
}
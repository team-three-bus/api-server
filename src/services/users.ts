import { Injectable } from '@nestjs/common';
import { UsersDao } from '../dao/users';
import { AddUsersDto } from '../dto/users';
import { createJWT } from '../utils/jwt';
import axios from "axios";


@Injectable()
export class UsersService {
  public constructor(private usersDao: UsersDao) {}
  
  public async login(token: string) {
    const kakaoUser = await this.getKakaoUser(token);
    const socialId = kakaoUser.data.id;
    const isUser = await this.getUser(socialId);
    if (!isUser) {
      // 가입 되어 있지 않기 때문에 가입 진행 
      await this.joinUser({
        socialId: socialId,
        nickname: kakaoUser.data.kakao_account.profile.nickname,
        platformType: 'kakao',
        gender: kakaoUser.data.kakao_account.age_range,
        ageRange: kakaoUser.data.kakao_account.gender,
      });
    }
    return createJWT(socialId);
  }

  public async getKakaoUser(token: string) {
    const kakaoRes = await axios({
      method: "GET",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return {
      result: "SUCCESS",
      data: kakaoRes.data
    }
  }

  public async getUser(socialId: string) {
    return await this.usersDao.getUser(socialId);
  }

  public async joinUser(user: AddUsersDto) {
    await this.usersDao.addUser(user);
  }
}
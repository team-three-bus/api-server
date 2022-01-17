import { Injectable } from '@nestjs/common';
import axios from "axios";


@Injectable()
export class UsersService {
  
  public async login(token: string) {
    const kakaoUser = await this.getKakaoUser(token);

    return kakaoUser;
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
}
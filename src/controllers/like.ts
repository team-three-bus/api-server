import { Controller, Get, Headers, Res} from '@nestjs/common';
import { LikeService } from '../services/like';
import { UsersService } from '../services/users';
import { decodeJWT } from '../utils/jwt';
import { Response } from 'express';

@Controller('like')
export class LikeController {
  public constructor(
    private readonly likeService: LikeService,
    private readonly usersService: UsersService
  ) {}

  @Get('/')
  public async getLikeList(@Headers() headers, @Res() res: Response) {
    console.log(headers.authorization);
    if (!headers.authorization) {
      res.status(401).json({message: "토큰을 첨부해주세요."});
    }
    const userTokenPayload = decodeJWT(headers.authorization);  
    if (!userTokenPayload) {
      res.status(401).json({message: "재 로그인이 필요합니다."});
    }
    const user = await this.usersService.getUser(userTokenPayload.socialId);
    
    const likeList = await this.likeService.likeList(user.id);
    
    res.json({
      list: likeList
    });
  }
}
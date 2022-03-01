import { Controller, Get, Post, Body, Headers, Res, HttpStatus, Put} from '@nestjs/common';
import { UsersService } from '../services/users';
import { decodeJWT } from '../utils/jwt';
import { Response } from 'express';


@Controller('users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}
  
  @Post('/')
  public async login(@Headers() headers): Promise<any> {
    
    const userData = await this.usersService.login(headers.authorization);
    
    return {
      jwt: userData
    };
  }

  @Get('/mypage')
  public async mypage(@Headers() headers, @Res() res: Response): Promise<any> {
    
    if (!headers.authorization) {
      res.status(401).json({message: "토큰을 첨부해주세요."});
    }
    const userTokenPayload = decodeJWT(headers.authorization);
    
    if (!userTokenPayload) {
      res.status(401).json({message: "재 로그인이 필요합니다."});
    }
    const user = await this.usersService.getUser(userTokenPayload.socialId);
   
    res.status(200).json({
      nickname: user.nickname
    });
  }

  @Put('/myname')
  public async updateMyName(@Headers() headers, @Res() res: Response, @Body() user): Promise<any> {
    if (!headers.authorization) {
      res.status(401).json({message: "토큰을 첨부해주세요."});
    }
    const userTokenPayload = decodeJWT(headers.authorization);
    
    if (!userTokenPayload) {
      res.status(401).json({message: "재 로그인이 필요합니다."});
    }

    await this.usersService.updateUserName(userTokenPayload.socialId, user.nickname);
  
    res.status(200).json({});
  }
}
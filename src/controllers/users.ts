import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { UsersService } from '../services/users';


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
}
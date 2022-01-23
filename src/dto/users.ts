import { IsString } from 'class-validator';

export class AddUsersDto {
  @IsString()
  socialId: string;

  @IsString()
  nickname: string;

  @IsString()
  platformType: string;

  @IsString()
  gender: string;

  @IsString()
  ageRange: string;
}

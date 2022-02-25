import { IsString } from 'class-validator';

export class getUserIdDto {
  @IsString()
  userId: number;
}

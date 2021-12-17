import { IsString } from 'class-validator';

export class AddTestsDto {
  @IsString()
  body: string;
}

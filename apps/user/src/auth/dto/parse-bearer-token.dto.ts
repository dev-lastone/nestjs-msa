import { IsString } from 'class-validator';

export class ParseBearerTokenDto {
  @IsString()
  token: string;
}

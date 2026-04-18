import { IsString, MinLength } from 'class-validator';

export class VerifySubscriberDto {
  @IsString()
  @MinLength(8)
  token!: string;
}

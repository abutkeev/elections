import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TelegramAuthDataDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  id: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ required: false })
  last_name?: string;

  @ApiProperty({ required: false })
  username?: string;

  @ApiProperty({ required: false })
  photo_url?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  auth_date: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  hash: string;
}

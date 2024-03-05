import { ApiProperty } from '@nestjs/swagger';

export class ResultDto {
  @ApiProperty({ required: true })
  user_id: number;

  @ApiProperty({ required: true })
  result: number;
}

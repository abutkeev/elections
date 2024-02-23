import { ApiProperty } from '@nestjs/swagger';

export class ChatDto {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: true })
  title: string;
}

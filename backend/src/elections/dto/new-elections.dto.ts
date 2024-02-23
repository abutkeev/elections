import { ApiProperty } from '@nestjs/swagger';

export class NewElectionsDto {
  @ApiProperty({ required: true })
  chat: number;

  @ApiProperty({ required: true })
  title: string;
}

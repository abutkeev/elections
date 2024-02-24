import { ApiProperty } from '@nestjs/swagger';

export class NewElectionsDto {
  @ApiProperty({ required: true })
  chat: number;

  @ApiProperty({ required: true })
  title: string;

  @ApiProperty({ required: false })
  start?: string;

  @ApiProperty({ required: false })
  end?: string;
}

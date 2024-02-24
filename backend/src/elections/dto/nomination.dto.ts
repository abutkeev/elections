import { ApiProperty } from '@nestjs/swagger';

export class NominationDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  program: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class CandidateDto {
  @ApiProperty({ required: true })
  user_id: number;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  program: string;
}

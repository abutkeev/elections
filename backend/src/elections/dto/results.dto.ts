import { ApiProperty } from '@nestjs/swagger';
import { ResultDto } from './result.dto';

export class ResultsDto {
  @ApiProperty({ required: true })
  votes: number[][];

  @ApiProperty({ required: true })
  schulze: ResultDto[];

  @ApiProperty({ required: true })
  firsts: ResultDto[];

  @ApiProperty({ required: true })
  lasts: ResultDto[];

  @ApiProperty({ required: true })
  top5: ResultDto[];

  @ApiProperty({ required: true })
  quorum: number;
}

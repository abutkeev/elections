import { ApiProperty } from '@nestjs/swagger';
import { CandidateDto } from './candidate.dto';

export class ElectionsDto {
  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  chat_id: number;

  @ApiProperty({ required: true })
  chat_title: string;

  @ApiProperty({ required: true })
  title: string;

  @ApiProperty({ required: false })
  start?: string;

  @ApiProperty({ required: false })
  end?: string;

  @ApiProperty({ required: true })
  can_edit: boolean;

  @ApiProperty({ required: true })
  candidates: CandidateDto[];

  @ApiProperty({ required: false })
  vote?: number[];
}

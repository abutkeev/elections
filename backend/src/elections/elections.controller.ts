import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Request } from '@nestjs/common';
import { ElectionsService } from './elections.service';
import { NewElectionsDto } from './dto/new-elections.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { NominationDto } from './dto/nomination.dto';

@ApiTags('elections')
@Controller('elections')
export class ElectionsController {
  constructor(private service: ElectionsService) {}

  @Get()
  get(@Request() { user }) {
    return this.service.get(user.id);
  }

  @Post()
  add(@Request() { user }, @Body() data: NewElectionsDto, @Headers() headers: Record<string, string>) {
    return this.service.add(user.id, data, headers['x-instance-id']);
  }

  @Put(':id')
  edit(
    @Request() { user },
    @Param('id') id: string,
    @Body() data: NewElectionsDto,
    @Headers() headers: Record<string, string>
  ) {
    return this.service.edit(user.id, id, data, headers['x-instance-id']);
  }

  @Put(':elections_id/nominate')
  nominate(
    @Request() { user },
    @Param('elections_id') id: string,
    @Body() data: NominationDto,
    @Headers() headers: Record<string, string>
  ) {
    return this.service.nominate(user.id, id, data, headers['x-instance-id']);
  }

  @Delete(':elections_id/nominate')
  withdraw(@Request() { user }, @Param('elections_id') id: string, @Headers() headers: Record<string, string>) {
    return this.service.withdraw(user.id, id, headers['x-instance-id']);
  }

  @Put(':elections_id/vote')
  @ApiBody({ type: [Number] })
  vote(
    @Request() { user },
    @Param('elections_id') id: string,
    @Body() data: number[],
    @Headers() headers: Record<string, string>
  ) {
    return this.service.vote(user.id, id, data, headers['x-instance-id']);
  }
}

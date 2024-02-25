import { Body, Controller, Delete, Get, Param, Post, Put, Request } from '@nestjs/common';
import { ElectionsService } from './elections.service';
import { NewElectionsDto } from './dto/new-elections.dto';
import { ApiTags } from '@nestjs/swagger';
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
  add(@Request() { user }, @Body() data: NewElectionsDto) {
    return this.service.add(user.id, data);
  }

  @Put(':id')
  edit(@Request() { user }, @Param('id') id: string, @Body() data: NewElectionsDto) {
    return this.service.edit(user.id, id, data);
  }

  @Put(':elections_id/nominate')
  nominate(@Request() { user }, @Param('elections_id') id: string, @Body() data: NominationDto) {
    return this.service.nominate(user.id, id, data);
  }

  @Delete(':elections_id/nominate')
  withdraw(@Request() { user }, @Param('elections_id') id: string) {
    return this.service.withdraw(user.id, id);
  }
}

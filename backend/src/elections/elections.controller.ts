import { Body, Controller, Get, Param, Post, Put, Request } from '@nestjs/common';
import { ElectionsService } from './elections.service';
import { NewElectionsDto } from './dto/new-elections.dto';
import { ApiTags } from '@nestjs/swagger';

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
}

import { Body, Controller, Post, Request } from '@nestjs/common';
import { ElectionsService } from './elections.service';
import { NewElectionsDto } from './dto/new-elections.dto';

@Controller('elections')
export class ElectionsController {
  constructor(private service: ElectionsService) {}

  @Post()
  add(@Request() { user }, @Body() data: NewElectionsDto) {
    return this.service.add(user.id, data);
  }
}

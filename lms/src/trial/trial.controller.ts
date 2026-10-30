import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TrialService } from './trial.service.js';

@Controller('trials')
export class TrialController {
  constructor(private readonly trialService: TrialService) {}

  @Get()
  findAll() {
    return this.trialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.trialService.findOne(id);
  }

  @Get(':id/solution')
  getSolution(@Param('id', ParseIntPipe) id: number) {
    return this.trialService.getSolution(id);
  }
}

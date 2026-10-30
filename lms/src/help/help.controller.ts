import { Body, Controller, Get, Post } from '@nestjs/common';
import { HelpService } from './help.service.js';

@Controller('help')
export class HelpController {
  constructor(private readonly helpService: HelpService) {}

  @Get('faq')
  getFaq() {
    return this.helpService.getFaq();
  }

  @Post('requests')
  createSupportRequest(
    @Body()
    body: {
      fullName: string;
      email: string;
      courseId?: number;
      topic: string;
      message: string;
      userId?: number;
    },
  ) {
    return this.helpService.createSupportRequest(body);
  }
}

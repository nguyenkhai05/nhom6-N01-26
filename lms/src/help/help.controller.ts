import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { HelpService } from './help.service.js';

@Controller('help')
export class HelpController {
  constructor(private readonly helpService: HelpService) {}

  @Get('faq')
  getFaq() {
    return this.helpService.getFaq();
  }

  @Get('requests/my')
  getMyRequests(@Query('email') email?: string, @Query('user_id') userId?: string) {
    return this.helpService.getUserTickets(userId || email);
  }

  @Get('requests')
  getAllRequests() {
    return this.helpService.getAllTickets();
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

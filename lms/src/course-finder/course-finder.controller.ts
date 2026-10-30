import { Body, Controller, Get, Post } from '@nestjs/common';
import { CourseFinderService } from './course-finder.service.js';
import { RecommendationRequestDto } from './dto/recommendation-request.dto.js';

@Controller('course-finder')
export class CourseFinderController {
  constructor(private readonly finderService: CourseFinderService) {}

  @Get('config')
  getConfig() {
    return this.finderService.getConfig();
  }

  @Post('recommendations')
  getRecommendations(@Body() dto: RecommendationRequestDto) {
    return this.finderService.getRecommendations(dto);
  }
}

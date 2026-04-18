import { Controller, Get, Query } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('today')
  getTodayNews(@Query('targetDate') targetDate?: string) {
    return this.newsService.getTodayNewsGrouped(targetDate);
  }
}

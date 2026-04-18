import { Controller, Get, Param, Query } from '@nestjs/common';
import { NewsService } from '../news/news.service';
import { TopicsService } from './topics.service';

@Controller('topics')
export class TopicsController {
  constructor(
    private readonly topicsService: TopicsService,
    private readonly newsService: NewsService,
  ) {}

  @Get()
  async getTopics() {
    return this.topicsService.getActiveTopics();
  }

  @Get(':topicKey/news/today')
  getTopicNewsToday(
    @Param('topicKey') topicKey: string,
    @Query('targetDate') targetDate?: string,
  ) {
    return this.newsService.getTodayNewsByTopic(topicKey, targetDate);
  }
}

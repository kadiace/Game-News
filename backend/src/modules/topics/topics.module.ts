import { Module } from '@nestjs/common'
import { TopicsController } from './topics.controller'
import { TopicsService } from './topics.service'
import { NewsModule } from '../news/news.module'

@Module({
  imports: [NewsModule],
  controllers: [TopicsController],
  providers: [TopicsService],
  exports: [TopicsService],
})
export class TopicsModule {}

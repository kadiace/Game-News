import { Module } from '@nestjs/common'
import { TopicsModule } from './modules/topics/topics.module'
import { NewsModule } from './modules/news/news.module'
import { SubscribersModule } from './modules/subscribers/subscribers.module'
import { PrismaModule } from './database/prisma/prisma.module'
import { CollectionModule } from './modules/collection/collection.module'
import { ProcessingModule } from './modules/processing/processing.module'

@Module({
  imports: [
    TopicsModule,
    NewsModule,
    SubscribersModule,
    PrismaModule,
    CollectionModule,
    ProcessingModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common'
import { RssSourceAdapter } from './adapters/rss-source.adapter'
import { CollectionService } from './collection.service'

@Module({
  providers: [CollectionService, RssSourceAdapter],
  exports: [CollectionService],
})
export class CollectionModule {}

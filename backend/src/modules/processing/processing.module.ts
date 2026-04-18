import { Module } from '@nestjs/common'
import { ProcessingService } from './processing.service'
import { NewsProcessor } from './interfaces/news-processor.interface'

@Module({
  providers: [ProcessingService],
  exports: [ProcessingService],
})
export class ProcessingModule {}

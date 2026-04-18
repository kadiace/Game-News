import { Injectable } from '@nestjs/common';
import { CollectedSourceItem } from './interfaces/source-adapter.interface';

@Injectable()
export class CollectionService {
  async collect(): Promise<CollectedSourceItem[]> {
    return [];
  }
}

import { Injectable } from '@nestjs/common';
import {
  CollectedSourceItem,
  SourceAdapter,
} from '../interfaces/source-adapter.interface';

@Injectable()
export class RssSourceAdapter implements SourceAdapter {
  async fetchItems(): Promise<CollectedSourceItem[]> {
    return [];
  }
}

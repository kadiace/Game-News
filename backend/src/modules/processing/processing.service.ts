import { Injectable } from '@nestjs/common';
import {
  MinimalRawSourceItem,
  NewsProcessor,
  ProcessedNewsOutput,
} from './interfaces/news-processor.interface';

@Injectable()
export class ProcessingService implements NewsProcessor {
  process(raw: MinimalRawSourceItem): ProcessedNewsOutput {
    const normalizedTitle = raw.title.replace(/\s+/g, ' ').trim();
    const summaryShort = raw.body.slice(0, 200).trim();
    const summaryLong = raw.body.trim();

    const tags = this.extractTags(`${normalizedTitle} ${summaryLong}`.toLowerCase());
    const trustScore = 0.8;
    const importanceScore = Math.min(1, 0.5 + tags.length * 0.05);
    const interestScore = Math.min(1, 0.55 + tags.length * 0.05);

    return {
      normalizedTitle,
      summaryShort,
      summaryLong,
      interestScore,
      importanceScore,
      trustScore,
      tags,
      dedupeGroupKey: normalizedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      isRepresentativeCandidate: trustScore >= 0.5,
    };
  }

  private extractTags(text: string): string[] {
    const tags: string[] = [];

    if (text.includes('earnings') || text.includes('revenue')) tags.push('earnings');
    if (text.includes('acquisition') || text.includes('investment')) tags.push('acquisition');
    if (text.includes('layoff') || text.includes('restructuring')) tags.push('restructuring');
    if (text.includes('policy') || text.includes('regulation')) tags.push('policy');

    return tags;
  }
}

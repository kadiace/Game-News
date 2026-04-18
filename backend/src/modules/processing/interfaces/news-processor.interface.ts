export interface MinimalRawSourceItem {
  id: string;
  topicKey: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  body: string;
  publishedAt: string | null;
}

export interface ProcessedNewsOutput {
  normalizedTitle: string;
  summaryShort: string;
  summaryLong: string;
  interestScore: number;
  importanceScore: number;
  trustScore: number;
  tags: string[];
  dedupeGroupKey: string;
  isRepresentativeCandidate: boolean;
}

export interface NewsProcessor {
  process(raw: MinimalRawSourceItem): ProcessedNewsOutput;
}

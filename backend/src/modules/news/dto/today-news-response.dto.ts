export interface TodayNewsItemDto {
  id: string;
  title: string;
  summaryShort: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string | null;
}

export interface TodayNewsByTopicDto {
  topicKey: string;
  displayName: string;
  items: TodayNewsItemDto[];
}

export interface TodayNewsResponseDto {
  targetDate: string;
  topics: TodayNewsByTopicDto[];
}

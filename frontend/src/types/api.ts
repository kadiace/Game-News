export type TopicKey =
  | 'global_general'
  | 'fps_esports'
  | 'rpg'
  | 'aaa_console'
  | 'indie_dev'
  | 'mobile_asia'
  | 'game_dev_tech'
  | 'business';

export interface TopicDto {
  key: TopicKey;
  displayName: string;
  description: string;
  sortOrder: number;
}

export interface TodayNewsItemDto {
  id: string;
  title: string;
  summaryShort: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string | null;
}

export interface TodayNewsByTopicDto {
  topicKey: TopicKey;
  displayName: string;
  items: TodayNewsItemDto[];
}

export interface TodayNewsResponseDto {
  targetDate: string;
  topics: TodayNewsByTopicDto[];
}

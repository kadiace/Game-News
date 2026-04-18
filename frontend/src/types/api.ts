export const TOPIC_KEYS = [
  'global_general',
  'fps_esports',
  'rpg',
  'aaa_console',
  'indie_dev',
  'mobile_asia',
  'game_dev_tech',
  'business',
] as const;

export type TopicKey = (typeof TOPIC_KEYS)[number];

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

const TOPIC_METADATA: Record<TopicKey, Pick<TopicDto, 'displayName' | 'description'>> = {
  global_general: {
    displayName: 'Global General',
    description: 'Major global game industry developments and broad daily coverage.',
  },
  fps_esports: {
    displayName: 'FPS & Esports',
    description: 'Competitive shooters, tournament scenes, and team-driven stories.',
  },
  rpg: {
    displayName: 'RPG',
    description: 'Role-playing games, expansions, launches, and community milestones.',
  },
  aaa_console: {
    displayName: 'AAA & Console',
    description: 'Big-budget console releases, platform updates, and flagship franchises.',
  },
  indie_dev: {
    displayName: 'Indie & Dev',
    description: 'Independent releases, studio updates, and emerging developer stories.',
  },
  mobile_asia: {
    displayName: 'Mobile Asia',
    description: 'Mobile-first launches and regional market developments across Asia.',
  },
  game_dev_tech: {
    displayName: 'Game Dev Tech',
    description: 'Engines, tooling, platforms, and technical workflows for making games.',
  },
  business: {
    displayName: 'Business',
    description: 'Earnings, acquisitions, layoffs, pricing, policy, and publisher strategy.',
  },
};

export function isTopicKey(value: string): value is TopicKey {
  return (TOPIC_KEYS as readonly string[]).includes(value);
}

export function getOrderedTopics(topics: TopicDto[] | null | undefined): TopicDto[] {
  const topicMap = new Map((topics ?? []).map((topic) => [topic.key, topic]));

  return TOPIC_KEYS.map((key, index) => {
    const topic = topicMap.get(key);

    if (topic) {
      return topic;
    }

    return {
      key,
      sortOrder: index,
      ...TOPIC_METADATA[key],
    };
  });
}

export function getTopicMeta(topicKey: TopicKey): Pick<TopicDto, 'displayName' | 'description'> {
  return TOPIC_METADATA[topicKey];
}

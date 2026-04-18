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

export interface TopicDefinition {
  key: TopicKey;
  displayName: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

export const TOPIC_DEFINITIONS: TopicDefinition[] = [
  {
    key: 'global_general',
    displayName: 'Global',
    description: 'Broad gaming news and major community conversation.',
    sortOrder: 1,
    isActive: true,
  },
  {
    key: 'fps_esports',
    displayName: 'FPS / Esports',
    description: 'Competitive shooters, esports events, meta shifts, and team news.',
    sortOrder: 2,
    isActive: true,
  },
  {
    key: 'rpg',
    displayName: 'RPG',
    description: 'JRPG, CRPG, action RPG, and RPG-focused franchise news.',
    sortOrder: 3,
    isActive: true,
  },
  {
    key: 'aaa_console',
    displayName: 'AAA / Console',
    description: 'Console platform updates and major AAA releases outside dedicated RPG coverage.',
    sortOrder: 4,
    isActive: true,
  },
  {
    key: 'indie_dev',
    displayName: 'Indie',
    description: 'Indie releases, showcases, discovery momentum, and developer updates.',
    sortOrder: 5,
    isActive: true,
  },
  {
    key: 'mobile_asia',
    displayName: 'Mobile / Asia',
    description: 'Mobile game updates and Asia-centric market and community signals.',
    sortOrder: 6,
    isActive: true,
  },
  {
    key: 'game_dev_tech',
    displayName: 'Game Dev / Tech',
    description: 'Engines, tools, AI, graphics, middleware, and development workflows.',
    sortOrder: 7,
    isActive: true,
  },
  {
    key: 'business',
    displayName: 'Business',
    description: 'Earnings, acquisitions, layoffs, restructuring, publisher strategy, platform policy, monetization, pricing, subscriptions, and regulation with business impact.',
    sortOrder: 8,
    isActive: true,
  },
];

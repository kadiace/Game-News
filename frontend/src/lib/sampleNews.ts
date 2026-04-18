import { NewsListItemDto, TopicDto } from '../types/api';

const SAMPLE_NEWS_BY_TOPIC: Record<TopicDto['key'], Omit<NewsListItemDto, 'topicDisplayName'> & { description: string }> = {
  global_general: {
    listKey: 'sample:global_general',
    id: 'sample-global-general',
    topicKey: 'global_general',
    title: 'Publishers quietly shift toward smaller seasonal updates instead of oversized surprise drops',
    description:
      'Studios are pacing announcements around steadier weekly beats, giving players clearer expectations while reducing the burnout cycle that often follows large one-off reveals.',
    summaryShort:
      'Studios are pacing announcements around steadier weekly beats, giving players clearer expectations while reducing the burnout cycle that often follows large one-off reveals.',
    sourceName: 'Game News Sample Desk',
    sourceUrl: 'https://example.com/global-general-sample',
    publishedAt: '2026-04-18T09:00:00.000Z',
  },
  fps_esports: {
    listKey: 'sample:fps_esports',
    id: 'sample-fps-esports',
    topicKey: 'fps_esports',
    title: 'Top FPS teams are rebuilding around flexible support players before the summer circuit',
    description:
      'Roster moves suggest coaches now value adaptable role coverage over star-only lineups, especially in tournaments with compressed prep schedules and frequent patch shifts.',
    summaryShort:
      'Roster moves suggest coaches now value adaptable role coverage over star-only lineups, especially in tournaments with compressed prep schedules and frequent patch shifts.',
    sourceName: 'Game News Sample Desk',
    sourceUrl: 'https://example.com/fps-esports-sample',
    publishedAt: '2026-04-18T07:30:00.000Z',
  },
  rpg: {
    listKey: 'sample:rpg',
    id: 'sample-rpg',
    topicKey: 'rpg',
    title: 'Narrative RPG roadmaps are leaning into shorter chapter releases with denser quest hubs',
    description:
      'Teams are experimenting with more frequent story drops that keep momentum high while still giving each update enough handcrafted dialogue and progression to feel substantial.',
    summaryShort:
      'Teams are experimenting with more frequent story drops that keep momentum high while still giving each update enough handcrafted dialogue and progression to feel substantial.',
    sourceName: 'Game News Sample Desk',
    sourceUrl: 'https://example.com/rpg-sample',
    publishedAt: '2026-04-17T18:00:00.000Z',
  },
  aaa_console: {
    listKey: 'sample:aaa_console',
    id: 'sample-aaa-console',
    topicKey: 'aaa_console',
    title: 'AAA console teams are prioritizing performance mode parity earlier in development',
    description:
      'Recent production updates point to performance targets being locked sooner, which reduces last-minute visual tradeoffs and helps platform launches feel more consistent.',
    summaryShort:
      'Recent production updates point to performance targets being locked sooner, which reduces last-minute visual tradeoffs and helps platform launches feel more consistent.',
    sourceName: 'Game News Sample Desk',
    sourceUrl: 'https://example.com/aaa-console-sample',
    publishedAt: '2026-04-17T11:15:00.000Z',
  },
  indie_dev: {
    listKey: 'sample:indie_dev',
    id: 'sample-indie-dev',
    topicKey: 'indie_dev',
    title: 'Indie studios keep using public milestone demos to validate scope before launch season',
    description:
      'Small teams are increasingly treating polished demo slices as production checkpoints, using player feedback to trim features without losing the game’s core hook.',
    summaryShort:
      'Small teams are increasingly treating polished demo slices as production checkpoints, using player feedback to trim features without losing the game’s core hook.',
    sourceName: 'Game News Sample Desk',
    sourceUrl: 'https://example.com/indie-dev-sample',
    publishedAt: '2026-04-16T20:45:00.000Z',
  },
  mobile_asia: {
    listKey: 'sample:mobile_asia',
    id: 'sample-mobile-asia',
    topicKey: 'mobile_asia',
    title: 'Mobile publishers in Asia are pairing live events with lighter onboarding funnels',
    description:
      'The current strategy favors faster first-session conversion, then uses event cadence and community rewards to deepen retention over the next several weeks.',
    summaryShort:
      'The current strategy favors faster first-session conversion, then uses event cadence and community rewards to deepen retention over the next several weeks.',
    sourceName: 'Game News Sample Desk',
    sourceUrl: 'https://example.com/mobile-asia-sample',
    publishedAt: '2026-04-16T09:20:00.000Z',
  },
  game_dev_tech: {
    listKey: 'sample:game_dev_tech',
    id: 'sample-game-dev-tech',
    topicKey: 'game_dev_tech',
    title: 'Engine teams are exposing more profiling tools directly inside creator-facing workflows',
    description:
      'Tooling updates are making optimization feedback easier to read during day-to-day development, which helps teams catch memory and frame-time regressions earlier.',
    summaryShort:
      'Tooling updates are making optimization feedback easier to read during day-to-day development, which helps teams catch memory and frame-time regressions earlier.',
    sourceName: 'Game News Sample Desk',
    sourceUrl: 'https://example.com/game-dev-tech-sample',
    publishedAt: '2026-04-15T16:10:00.000Z',
  },
  business: {
    listKey: 'sample:business',
    id: 'sample-business',
    topicKey: 'business',
    title: 'Game business strategy is shifting toward slower pricing experiments and clearer player messaging',
    description:
      'Publishers are testing commercial changes with narrower rollout windows first, trying to reduce backlash and gather cleaner retention data before wider release.',
    summaryShort:
      'Publishers are testing commercial changes with narrower rollout windows first, trying to reduce backlash and gather cleaner retention data before wider release.',
    sourceName: 'Game News Sample Desk',
    sourceUrl: 'https://example.com/business-sample',
    publishedAt: '2026-04-15T08:00:00.000Z',
  },
};

export function getSampleNewsItems(topics: TopicDto[]): NewsListItemDto[] {
  return topics.map((topic) => {
    const sample = SAMPLE_NEWS_BY_TOPIC[topic.key];

    return {
      ...sample,
      topicDisplayName: topic.displayName,
      summaryShort: sample.description,
    };
  });
}

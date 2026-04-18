import { TopicKey } from '../topics/topic.types'

export const SOURCE_KINDS = ['rss'] as const

export type SourceKind = (typeof SOURCE_KINDS)[number]

export type SourceReliability = 'official' | 'media' | 'community' | 'rumor'

export interface SourceDefinition {
  key: string
  kind: SourceKind
  enabled: boolean
  topicKey: TopicKey
  sourceType: SourceReliability
  sourceName: string
  sourceUrl: string
  feedUrl: string
  language: string | null
  metadata?: Record<string, string | number | boolean | null>
}

export const SOURCE_REGISTRY: readonly SourceDefinition[] = [
  {
    key: 'steam-news',
    kind: 'rss',
    enabled: true,
    topicKey: 'global_general',
    sourceType: 'official',
    sourceName: 'Steam News',
    sourceUrl: 'https://store.steampowered.com/news/',
    feedUrl: 'https://store.steampowered.com/feeds/news.xml',
    language: 'en',
    metadata: {
      region: 'global',
      format: 'rss',
    },
  },
]

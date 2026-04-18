import { SourceDefinition, SourceKind, SourceReliability } from '../../sources/source-registry'
import { TopicKey } from '../../topics/topic.types'

export interface CollectedSourceItem {
  sourceKey: string
  topicKey: TopicKey
  sourceType: SourceReliability
  sourceName: string
  sourceUrl: string
  title: string
  body: string
  author: string | null
  publishedAt: string | null
  collectedAt: string
  language: string | null
  hash: string
  metadata: Record<string, unknown>
}

export interface CollectionError {
  sourceKey: string
  message: string
}

export interface CollectionResult {
  items: CollectedSourceItem[]
  errors: CollectionError[]
}

export interface SourceAdapter {
  readonly kind: SourceKind
  fetchItems(source: SourceDefinition): Promise<CollectedSourceItem[]>
}

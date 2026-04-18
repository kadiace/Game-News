import { SourceReliability } from '../../sources/source-registry'

export interface MinimalRawSourceItem {
  id: string
  topicKey: string
  sourceName: string
  sourceUrl: string
  sourceType?: SourceReliability
  title: string
  body: string
  author?: string | null
  language?: string | null
  publishedAt: string | null
}

export interface ProcessedNewsOutput {
  normalizedTitle: string
  summaryShort: string
  summaryLong: string
  interestScore: number
  importanceScore: number
  trustScore: number
  tags: string[]
  dedupeGroupKey: string
  isRepresentativeCandidate: boolean
}

export interface NewsProcessor {
  process(raw: MinimalRawSourceItem): ProcessedNewsOutput
}

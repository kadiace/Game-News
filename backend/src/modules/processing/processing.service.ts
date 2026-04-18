import { Injectable } from '@nestjs/common'
import {
  MinimalRawSourceItem,
  NewsProcessor,
  ProcessedNewsOutput,
} from './interfaces/news-processor.interface'

const MAX_SHORT_SUMMARY_LENGTH = 180
const MAX_LONG_SUMMARY_LENGTH = 800

const TAG_RULES: Array<{ tag: string; keywords: readonly string[] }> = [
  { tag: 'release', keywords: ['launch', 'release', 'available now', 'out now', 'ships'] },
  { tag: 'update', keywords: ['patch', 'update', 'hotfix', 'season', 'roadmap'] },
  { tag: 'esports', keywords: ['tournament', 'esports', 'league', 'championship', 'bracket'] },
  { tag: 'earnings', keywords: ['earnings', 'revenue', 'quarter', 'guidance'] },
  { tag: 'acquisition', keywords: ['acquisition', 'acquire', 'merger', 'investment'] },
  { tag: 'restructuring', keywords: ['layoff', 'layoffs', 'restructuring', 'job cuts'] },
  { tag: 'policy', keywords: ['policy', 'regulation', 'lawsuit', 'compliance'] },
  { tag: 'mobile', keywords: ['ios', 'android', 'mobile', 'gacha'] },
  { tag: 'ai', keywords: ['ai', 'artificial intelligence', 'machine learning'] },
  { tag: 'engine', keywords: ['engine', 'unity', 'unreal', 'godot', 'toolchain'] },
]

@Injectable()
export class ProcessingService implements NewsProcessor {
  process(raw: MinimalRawSourceItem): ProcessedNewsOutput {
    const normalizedTitle = this.normalizeTitle(raw.title)
    const summaryLong = this.buildLongSummary(raw.body, normalizedTitle)
    const summaryShort = this.buildShortSummary(summaryLong, normalizedTitle)
    const tags = this.extractTags(raw, normalizedTitle, summaryLong)
    const trustScore = this.calculateTrustScore(raw)
    const importanceScore = this.calculateImportanceScore(raw, tags, summaryLong)
    const interestScore = this.calculateInterestScore(raw, tags, summaryLong)

    return {
      normalizedTitle,
      summaryShort,
      summaryLong,
      interestScore,
      importanceScore,
      trustScore,
      tags,
      dedupeGroupKey: this.buildDedupeGroupKey(normalizedTitle),
      isRepresentativeCandidate: trustScore >= 0.7 && importanceScore >= 0.6,
    }
  }

  private normalizeTitle(title: string): string {
    return title
      .replace(/\s*[|•·-]\s*(official|trailer|video)$/i, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  private buildLongSummary(body: string, normalizedTitle: string): string {
    const sanitizedBody = this.normalizeWhitespace(body)

    if (!sanitizedBody) {
      return normalizedTitle
    }

    return sanitizedBody.slice(0, MAX_LONG_SUMMARY_LENGTH).trim()
  }

  private buildShortSummary(summaryLong: string, normalizedTitle: string): string {
    const firstSentence = summaryLong.match(/^(.+?[.!?])(\s|$)/)?.[1]?.trim()
    const base = firstSentence || summaryLong || normalizedTitle

    if (base.length <= MAX_SHORT_SUMMARY_LENGTH) {
      return base
    }

    return `${base.slice(0, MAX_SHORT_SUMMARY_LENGTH - 1).trimEnd()}…`
  }

  private extractTags(raw: MinimalRawSourceItem, normalizedTitle: string, summaryLong: string): string[] {
    const haystack = `${raw.topicKey} ${normalizedTitle} ${summaryLong}`.toLowerCase()
    const tags = new Set<string>()

    for (const rule of TAG_RULES) {
      if (rule.keywords.some((keyword) => haystack.includes(keyword))) {
        tags.add(rule.tag)
      }
    }

    if (raw.topicKey === 'business') {
      tags.add('business')
    }

    if (raw.topicKey === 'game_dev_tech') {
      tags.add('dev-tech')
    }

    if (raw.topicKey === 'fps_esports') {
      tags.add('competitive')
    }

    return Array.from(tags).sort()
  }

  private calculateTrustScore(raw: MinimalRawSourceItem): number {
    const baseScoreBySourceType: Record<string, number> = {
      official: 0.95,
      media: 0.82,
      community: 0.62,
      rumor: 0.35,
    }

    const sourceTypeScore = raw.sourceType ? baseScoreBySourceType[raw.sourceType] ?? 0.7 : 0.75
    const bodyBonus = raw.body.trim() ? 0.03 : -0.08
    const publishedAtBonus = raw.publishedAt ? 0.02 : 0

    return this.clamp(sourceTypeScore + bodyBonus + publishedAtBonus)
  }

  private calculateImportanceScore(
    raw: MinimalRawSourceItem,
    tags: string[],
    summaryLong: string,
  ): number {
    let score = 0.45

    score += Math.min(tags.length, 4) * 0.07
    score += this.getTopicWeight(raw.topicKey)

    if (summaryLong.length >= 240) {
      score += 0.05
    }

    if (tags.includes('release') || tags.includes('earnings') || tags.includes('acquisition')) {
      score += 0.08
    }

    return this.clamp(score)
  }

  private calculateInterestScore(raw: MinimalRawSourceItem, tags: string[], summaryLong: string): number {
    let score = 0.5

    score += Math.min(tags.length, 4) * 0.06

    if (summaryLong.length >= 160) {
      score += 0.04
    }

    if (raw.topicKey === 'fps_esports' || raw.topicKey === 'rpg' || raw.topicKey === 'indie_dev') {
      score += 0.06
    }

    if (tags.includes('esports') || tags.includes('update') || tags.includes('release')) {
      score += 0.05
    }

    return this.clamp(score)
  }

  private getTopicWeight(topicKey: string): number {
    switch (topicKey) {
      case 'business':
        return 0.12
      case 'game_dev_tech':
        return 0.08
      case 'aaa_console':
        return 0.08
      default:
        return 0.04
    }
  }

  private buildDedupeGroupKey(normalizedTitle: string): string {
    return normalizedTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s]+/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 2)
      .slice(0, 12)
      .join('-')
  }

  private normalizeWhitespace(value: string): string {
    return value.replace(/\s+/g, ' ').trim()
  }

  private clamp(value: number): number {
    return Math.max(0, Math.min(1, Number(value.toFixed(2))))
  }
}

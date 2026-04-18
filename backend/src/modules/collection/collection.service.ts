import { Injectable } from '@nestjs/common'
import { RssSourceAdapter } from './adapters/rss-source.adapter'
import { CollectionError, CollectionResult, CollectedSourceItem, SourceAdapter } from './interfaces/source-adapter.interface'
import { SOURCE_REGISTRY, SourceKind } from '../sources/source-registry'

@Injectable()
export class CollectionService {
  private readonly adapters: Record<SourceKind, SourceAdapter>

  constructor(private readonly rssSourceAdapter: RssSourceAdapter) {
    this.adapters = {
      rss: this.rssSourceAdapter,
    }
  }

  async collect(): Promise<CollectionResult> {
    const enabledSources = SOURCE_REGISTRY.filter((source) => source.enabled)
    const results = await Promise.all(
      enabledSources.map(async (source) => {
        const adapter = this.adapters[source.kind]

        if (!adapter) {
          return {
            items: [] as CollectedSourceItem[],
            errors: [{ sourceKey: source.key, message: `No adapter registered for ${source.kind}` }],
          }
        }

        try {
          const items = await adapter.fetchItems(source)

          return { items, errors: [] as CollectionError[] }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown collection error'

          return {
            items: [] as CollectedSourceItem[],
            errors: [{ sourceKey: source.key, message }],
          }
        }
      }),
    )

    return {
      items: results
        .flatMap((result) => result.items)
        .sort((left, right) => this.compareItems(left, right)),
      errors: results.flatMap((result) => result.errors),
    }
  }

  private compareItems(left: CollectedSourceItem, right: CollectedSourceItem): number {
    const publishedAtComparison = (right.publishedAt ?? '').localeCompare(left.publishedAt ?? '')

    if (publishedAtComparison !== 0) {
      return publishedAtComparison
    }

    const sourceKeyComparison = left.sourceKey.localeCompare(right.sourceKey)

    if (sourceKeyComparison !== 0) {
      return sourceKeyComparison
    }

    return left.title.localeCompare(right.title)
  }
}

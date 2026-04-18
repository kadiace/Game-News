import { Injectable } from '@nestjs/common'
import { createHash } from 'node:crypto'
import * as http from 'node:http'
import * as https from 'node:https'
import { CollectedSourceItem, SourceAdapter } from '../interfaces/source-adapter.interface'
import { SourceDefinition } from '../../sources/source-registry'

@Injectable()
export class RssSourceAdapter implements SourceAdapter {
  readonly kind = 'rss' as const

  async fetchItems(source: SourceDefinition): Promise<CollectedSourceItem[]> {
    const xml = await this.fetchText(source.feedUrl)
    const channelXml = this.extractChannelXml(xml)
    const channelLanguage = this.extractTagValue(channelXml, ['language'])
    const itemBlocks = this.extractItemBlocks(xml, channelXml)

    return itemBlocks
      .map((itemXml) => this.parseItem(source, itemXml, channelLanguage))
      .filter((item): item is CollectedSourceItem => item !== null)
  }

  private parseItem(
    source: SourceDefinition,
    itemXml: string,
    channelLanguage: string | null,
  ): CollectedSourceItem | null {
    const rawTitle = this.extractTagValue(itemXml, ['title'])
    const rawBody =
      this.extractTagValue(itemXml, ['content:encoded', 'description']) ??
      this.extractTagValue(itemXml, ['description'])
    const sourceUrl = this.extractPrimaryUrl(itemXml)

    const title = this.normalizeWhitespace(this.decodeXml(rawTitle ?? ''))
    const body = this.normalizeWhitespace(this.stripHtml(this.decodeXml(rawBody ?? '')))

    if (!title || !sourceUrl) {
      return null
    }

    const author = this.normalizeNullable(
      this.decodeXml(this.extractTagValue(itemXml, ['dc:creator', 'author']) ?? ''),
    )
    const publishedAt = this.normalizeDate(
      this.extractTagValue(itemXml, ['pubDate', 'published', 'updated']),
    )
    const guid = this.normalizeNullable(this.decodeXml(this.extractTagValue(itemXml, ['guid']) ?? ''))
    const collectedAt = new Date().toISOString()

    return {
      sourceKey: source.key,
      topicKey: source.topicKey,
      sourceType: source.sourceType,
      sourceName: source.sourceName,
      sourceUrl,
      title,
      body,
      author,
      publishedAt,
      collectedAt,
      language: source.language ?? channelLanguage,
      hash: this.createHash(source.key, sourceUrl, title, publishedAt),
      metadata: {
        kind: source.kind,
        feedUrl: source.feedUrl,
        guid,
        channelLanguage,
        ...source.metadata,
      },
    }
  }

  private async fetchText(url: string, redirectCount = 0): Promise<string> {
    if (redirectCount > 3) {
      throw new Error(`Too many redirects while fetching ${url}`)
    }

    const client = url.startsWith('https:') ? https : http

    return new Promise<string>((resolve, reject) => {
      const request = client.get(
        url,
        {
          headers: {
            Accept: 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
            'User-Agent': 'Game-News-Collector/0.1',
          },
        },
        (response) => {
          const statusCode = response.statusCode ?? 500
          const location = response.headers.location

          if (statusCode >= 300 && statusCode < 400 && location) {
            response.resume()
            const nextUrl = new URL(location, url).toString()
            this.fetchText(nextUrl, redirectCount + 1).then(resolve).catch(reject)

            return
          }

          if (statusCode < 200 || statusCode >= 300) {
            response.resume()
            reject(new Error(`Request failed for ${url} with status ${statusCode}`))

            return
          }

          const chunks: Buffer[] = []

          response.on('data', (chunk) => {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
          })
          response.on('end', () => {
            resolve(Buffer.concat(chunks).toString('utf8'))
          })
        },
      )

      request.on('error', reject)
    })
  }

  private extractChannelXml(xml: string): string {
    const channelMatch = xml.match(/<channel\b[^>]*>([\s\S]*?)<\/channel>/i)

    return channelMatch?.[1] ?? xml
  }

  private extractItemBlocks(xml: string, channelXml: string): string[] {
    const channelItems = this.extractTagBlocks(channelXml, 'item')

    if (channelItems.length > 0) {
      return channelItems
    }

    return this.extractTagBlocks(xml, 'item')
  }

  private extractTagBlocks(xml: string, tagName: string): string[] {
    const escapedTagName = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`<${escapedTagName}\\b[^>]*>([\\s\\S]*?)<\\/${escapedTagName}>`, 'gi')
    const matches = Array.from(xml.matchAll(regex))

    return matches.map((match) => match[1]).filter(Boolean)
  }

  private extractTagValue(xml: string, tagNames: string[]): string | null {
    for (const tagName of tagNames) {
      const escapedTagName = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`<${escapedTagName}\\b[^>]*>([\\s\\S]*?)<\\/${escapedTagName}>`, 'i')
      const match = xml.match(regex)

      if (match?.[1]) {
        return match[1].trim()
      }
    }

    return null
  }

  private extractPrimaryUrl(xml: string): string | null {
    const link = this.normalizeNullable(this.decodeXml(this.extractTagValue(xml, ['link']) ?? ''))

    if (link) {
      return link
    }

    const enclosureMatch = xml.match(/<enclosure\b[^>]*url=["']([^"']+)["'][^>]*>/i)

    return this.normalizeNullable(this.decodeXml(enclosureMatch?.[1] ?? ''))
  }

  private normalizeDate(value: string | null): string | null {
    if (!value) {
      return null
    }

    const parsed = new Date(value)

    if (Number.isNaN(parsed.getTime())) {
      return null
    }

    return parsed.toISOString()
  }

  private createHash(sourceKey: string, sourceUrl: string, title: string, publishedAt: string | null): string {
    return createHash('sha256')
      .update([sourceKey, sourceUrl, title, publishedAt ?? ''].join('|'))
      .digest('hex')
  }

  private stripHtml(value: string): string {
    return value.replace(/<[^>]+>/g, ' ')
  }

  private decodeXml(value: string): string {
    return value
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, '&')
      .trim()
  }

  private normalizeWhitespace(value: string): string {
    return value.replace(/\s+/g, ' ').trim()
  }

  private normalizeNullable(value: string): string | null {
    const normalized = this.normalizeWhitespace(value)

    return normalized ? normalized : null
  }
}

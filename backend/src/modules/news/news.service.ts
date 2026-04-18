import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
  getTargetDateRangeUtc,
  resolveCanonicalTargetDate,
} from '../../common/utils/target-date.util';
import { TodayNewsByTopicDto, TodayNewsResponseDto } from './dto/today-news-response.dto';

interface TopicRow {
  id: string;
  key: string;
  displayName: string;
}

interface NewsRow {
  id: string;
  normalizedTitle: string;
  summaryShort: string;
  rawSourceItem: {
    sourceName: string;
    sourceUrl: string;
    publishedAt: Date | null;
  };
}

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTodayNewsGrouped(targetDateOverride?: string): Promise<TodayNewsResponseDto> {
    const targetDate = resolveCanonicalTargetDate(targetDateOverride);
    const range = getTargetDateRangeUtc(targetDate);

    const topicRows = (await this.prisma.topic.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, key: true, displayName: true },
    })) as TopicRow[];

    const topics = await Promise.all(
      topicRows.map(async (topic: TopicRow) => {
        const rows = (await this.prisma.processedNewsItem.findMany({
          where: { topicId: topic.id, targetDate: { gte: range.gte, lt: range.lt } },
          orderBy: [
            { importanceScore: 'desc' },
            { interestScore: 'desc' },
            { trustScore: 'desc' },
          ],
          take: 3,
          include: {
            rawSourceItem: {
              select: { sourceName: true, sourceUrl: true, publishedAt: true },
            },
          },
        })) as NewsRow[];

        return {
          topicKey: topic.key,
          displayName: topic.displayName,
          items: rows.map((item: NewsRow) => ({
            id: item.id,
            title: item.normalizedTitle,
            summaryShort: item.summaryShort,
            sourceName: item.rawSourceItem.sourceName,
            sourceUrl: item.rawSourceItem.sourceUrl,
            publishedAt: item.rawSourceItem.publishedAt?.toISOString() ?? null,
          })),
        };
      }),
    );

    return { targetDate, topics };
  }

  async getTodayNewsByTopic(topicKey: string, targetDateOverride?: string): Promise<TodayNewsByTopicDto> {
    const targetDate = resolveCanonicalTargetDate(targetDateOverride);
    const range = getTargetDateRangeUtc(targetDate);

    const topic = await this.prisma.topic.findUnique({
      where: { key: topicKey },
      select: { id: true, key: true, displayName: true, isActive: true },
    });

    if (!topic || !topic.isActive) {
      throw new NotFoundException('Topic not found.');
    }

    const rows = (await this.prisma.processedNewsItem.findMany({
      where: { topicId: topic.id, targetDate: { gte: range.gte, lt: range.lt } },
      orderBy: [
        { importanceScore: 'desc' },
        { interestScore: 'desc' },
        { trustScore: 'desc' },
      ],
      take: 3,
      include: {
        rawSourceItem: {
          select: { sourceName: true, sourceUrl: true, publishedAt: true },
        },
      },
    })) as NewsRow[];

    return {
      topicKey: topic.key,
      displayName: topic.displayName,
      items: rows.map((item: NewsRow) => ({
        id: item.id,
        title: item.normalizedTitle,
        summaryShort: item.summaryShort,
        sourceName: item.rawSourceItem.sourceName,
        sourceUrl: item.rawSourceItem.sourceUrl,
        publishedAt: item.rawSourceItem.publishedAt?.toISOString() ?? null,
      })),
    };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class TopicsService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveTopics() {
    return this.prisma.topic.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        key: true,
        displayName: true,
        description: true,
        sortOrder: true,
      },
    });
  }
}

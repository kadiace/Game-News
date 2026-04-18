import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class SubscribersService {
  constructor(private readonly prisma: PrismaService) {}

  async subscribe(email: string) {
    return this.prisma.subscriber.upsert({
      where: { email },
      update: {
        status: 'pending',
        verificationToken: randomUUID(),
        unsubscribedAt: null,
      },
      create: {
        email,
        status: 'pending',
        verificationToken: randomUUID(),
      },
      select: {
        id: true,
        email: true,
        status: true,
        subscribedAt: true,
      },
    });
  }

  async verify(token: string) {
    const subscriber = await this.prisma.subscriber.findUnique({
      where: { verificationToken: token },
      select: { id: true },
    });

    if (!subscriber) {
      throw new NotFoundException('Verification token is invalid or expired.');
    }

    return this.prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        status: 'active',
        verifiedAt: new Date(),
        verificationToken: null,
      },
      select: {
        id: true,
        email: true,
        status: true,
        verifiedAt: true,
      },
    });
  }

  async unsubscribe(email: string) {
    const subscriber = await this.prisma.subscriber.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!subscriber) {
      throw new NotFoundException('Subscriber not found.');
    }

    return this.prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        status: 'unsubscribed',
        unsubscribedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        status: true,
        unsubscribedAt: true,
      },
    });
  }
}

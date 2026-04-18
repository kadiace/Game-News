import { PrismaClient } from '@prisma/client';
import { TOPIC_DEFINITIONS } from '../src/common/types/topic.constants';

const prisma = new PrismaClient();

async function main() {
  for (const topic of TOPIC_DEFINITIONS) {
    await prisma.topic.upsert({
      where: { key: topic.key },
      update: {
        displayName: topic.displayName,
        description: topic.description,
        sortOrder: topic.sortOrder,
        isActive: topic.isActive,
      },
      create: {
        key: topic.key,
        displayName: topic.displayName,
        description: topic.description,
        sortOrder: topic.sortOrder,
        isActive: topic.isActive,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

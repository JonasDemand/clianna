import { Prisma, PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { createPrismaRedisCache } from 'prisma-redis-middleware';

const redis = new Redis(); // Uses default options for Redis connection

const prisma = new PrismaClient();

const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
  storage: {
    type: 'redis',
    options: {
      client: redis,
      invalidation: { referencesTTL: 300 },
      log: console,
    },
  },
  cacheTime: 300,
  onHit: (key) => {
    console.log('hit', key);
  },
  onMiss: (key) => {
    console.log('miss', key);
  },
  onError: (key) => {
    console.log('error', key);
  },
});

prisma.$use(cacheMiddleware);

export default prisma;

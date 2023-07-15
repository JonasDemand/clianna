import { PrismaClient } from '@prisma/client';
import { createPrismaRedisCache } from 'prisma-redis-middleware';

import { Customer } from './customer';
import { Document } from './document';
import { Order } from './order';
import { User } from './user';

const prisma = new PrismaClient();

prisma.$use(
  createPrismaRedisCache({
    storage: { type: 'memory', options: { invalidation: true } },
    cacheTime: 24 * 60 * 60,
    onHit: (_) => {
      console.log('cache hit');
    },
    onMiss: (_) => {
      console.log('cache miss');
    },
    onError: (_) => {
      console.log('cache error');
    },
    onDedupe: (_) => {
      console.log('cache dedupe');
    },
  })
);

prisma.$use(async (params, next) => {
  if (
    params.action.includes('create') ||
    params.action.includes('update') ||
    params.action.includes('upsert')
  ) {
    DbRepo.RevalidateCache();
  }

  return await next(params);
});

export class DbRepo {
  public static Client = prisma;
  public static RevalidateCache = () => {
    //Customer
    DbRepo.Customer.GetAll(true);
    DbRepo.Customer.GetAll(false);
    DbRepo.Customer.GetActive(true);
    DbRepo.Customer.GetActive(false);
    DbRepo.Customer.GetOnlyMeta();
    DbRepo.Customer.GetOnlyMeta();

    //Order
    DbRepo.Order.GetAll(true);
    DbRepo.Order.GetAll(false);

    //Document
    DbRepo.Document.GetAll(true);
    DbRepo.Document.GetAll(false);
    DbRepo.Document.GetTemplates();
  };

  public static User = User;
  public static Order = Order;
  public static Customer = Customer;
  public static Document = Document;
}

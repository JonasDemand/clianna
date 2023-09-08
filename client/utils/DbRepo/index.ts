import { PrismaClient } from '@prisma/client';

import { Customer } from './customer';
import { Document } from './document';
import { Order } from './order';
import { User } from './user';

const prisma = new PrismaClient();

/*prisma.$use(
  createPrismaRedisCache({
    storage: {
      type: 'memory',
      options: { invalidation: true, log: console },
    },
    models: [
      {
        model: 'Customer',
        cacheKey: 'customer',
        invalidateRelated: ['Order', 'Document', 'Customer'],
      },
      {
        model: 'Order',
        cacheKey: 'order',
        invalidateRelated: ['Customer', 'Document'],
      },
      {
        model: 'Document',
        cacheKey: 'document',
        invalidateRelated: ['Customer', 'Order'],
      },
    ],
    excludeModels: ['User'],
    cacheTime: 24 * 60 * 60,
    onHit: (key) => {
      console.log('cache hit: ' + key);
    },
    onMiss: (key) => {
      console.log('cache miss: ' + key);
    },
    onError: (key) => {
      console.log('cache error: ' + key);
    },
    onDedupe: (key) => {
      console.log('cache dedupe: ' + key);
    },
  })
);*/

/*prisma.$use(async (params, next) => {
  if (
    params.action.includes('create') ||
    params.action.includes('update') ||
    params.action.includes('upsert')
  ) {
    DbRepo.RevalidateCache();
  }

  return await next(params);
});*/

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

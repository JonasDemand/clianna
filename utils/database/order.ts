import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Order {
  public async Create() {
    throw new Error('not Implemented');
  }
  public async Update() {
    throw new Error('not Implemented');
  }
  public async Delete() {
    throw new Error('not Implemented');
  }
  public async GetAll() {
    return await prisma.order.findMany({
      include: { customer: true },
    });
  }
  public async GetSingle() {
    throw new Error('not Implemented');
  }
}

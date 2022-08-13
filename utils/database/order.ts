import { IOrderWithCustomer } from '@customTypes/database/order';
import { Order as PrismaOrder, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Order {
  public async Create<IC extends boolean>(
    customer: Omit<PrismaOrder, 'id'>,
    includeCustomer: IC
  ): Promise<IC extends true ? IOrderWithCustomer : PrismaOrder> {
    return await prisma.order.create({
      data: customer,
      include: { customer: !!includeCustomer },
    });
  }
  public async GetAll<IC extends boolean>(
    includeCustomer: IC
  ): Promise<IC extends true ? IOrderWithCustomer[] : PrismaOrder[]> {
    return await prisma.order.findMany({
      include: { customer: !!includeCustomer },
      where: { customer: { disabled: false } },
    });
  }
  public async GetSingle() {
    throw new Error('not Implemented');
  }
  public async Update<IC extends boolean>(
    id: number,
    customer: Omit<PrismaOrder, 'id'>,
    includeCustomer: IC
  ): Promise<IC extends true ? IOrderWithCustomer : PrismaOrder> {
    return await prisma.order.update({
      where: { id },
      include: { customer: !!includeCustomer },
      data: customer,
    });
  }
  public async Delete() {
    throw new Error('not Implemented');
  }
}

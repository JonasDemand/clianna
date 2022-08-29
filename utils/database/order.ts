import { IOrderWithCustomer } from '@customTypes/database/order';
import { Order as PrismaOrder, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Order {
  public async Create<IC extends boolean>(
    order: Omit<PrismaOrder, 'id'>,
    includeCustomer: IC
  ): Promise<IC extends true ? IOrderWithCustomer : PrismaOrder> {
    return await prisma.order.create({
      data: order,
      include: { customer: !!includeCustomer },
    });
  }
  public async GetAll<IC extends boolean>(
    includeCustomer: IC
  ): Promise<IC extends true ? IOrderWithCustomer[] : PrismaOrder[]> {
    return await prisma.order.findMany({
      include: { customer: !!includeCustomer },
      where: { OR: [{ customer: null }, { customer: { disabled: false } }] },
    });
  }
  public async GetSingle<IC extends boolean>(
    id: number,
    includeCustomer: IC
  ): Promise<(IC extends true ? IOrderWithCustomer : PrismaOrder) | null> {
    return await prisma.order.findUnique({
      where: { id },
      include: { customer: !!includeCustomer },
    });
  }
  public async Update<IC extends boolean>(
    id: number,
    order: Omit<PrismaOrder, 'id'>,
    includeCustomer: IC
  ): Promise<IC extends true ? IOrderWithCustomer : PrismaOrder> {
    return await prisma.order.update({
      where: { id },
      include: { customer: !!includeCustomer },
      data: order,
    });
  }
  public async Delete() {
    throw new Error('not Implemented');
  }
}

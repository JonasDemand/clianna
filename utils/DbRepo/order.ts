import { IOrder, IOrderWithCustomer } from '@customTypes/database/order';
import { PrismaClient } from '@prisma/client';

import { Customer } from './customer';

const prisma = new PrismaClient();

export class Order {
  public static DefaultSelect = {
    id: true,
    customerId: true,
    creationDate: true,
    pending: true,
    shippingType: true,
    comment: true,
    price: true,
    taxes: true,
    dueDate: true,
    type: true,
    specification: true,
    brand: true,
    article: true,
    color: true,
    dealer: true,
    size: true,
    name: true,
  };

  private UserId: number;
  public constructor(userId: number) {
    this.UserId = userId;
  }

  public async Create<IC extends boolean>(
    order: Omit<IOrder, 'id'>,
    includeCustomer: IC
  ): Promise<IC extends true ? IOrderWithCustomer : IOrder> {
    return await prisma.order.create({
      data: { ...order, userId: this.UserId },
      select: {
        ...Order.DefaultSelect,
        customer: includeCustomer ? { select: Customer.DefaultSelect } : false,
      },
    });
  }
  public async GetAll<IC extends boolean>(
    includeCustomer: IC
  ): Promise<IC extends true ? IOrderWithCustomer[] : IOrder[]> {
    return await prisma.order.findMany({
      where: {
        userId: this.UserId,
        AND: [{ OR: [{ customer: null }, { customer: { disabled: false } }] }],
      },
      select: {
        ...Order.DefaultSelect,
        customer: includeCustomer ? { select: Customer.DefaultSelect } : false,
      },
    });
  }
  public async GetSingle<IC extends boolean>(
    id: number,
    includeCustomer: IC
  ): Promise<(IC extends true ? IOrderWithCustomer : IOrder) | null> {
    return await prisma.order.findFirst({
      where: { AND: [{ userId: this.UserId }, { id }] },
      select: {
        ...Order.DefaultSelect,
        customer: includeCustomer ? { select: Customer.DefaultSelect } : false,
      },
    });
  }
  public async Update<IC extends boolean>(
    id: number,
    order: Omit<IOrder, 'id'>,
    includeCustomer: IC
  ): Promise<IC extends true ? IOrderWithCustomer : IOrder> {
    await prisma.order.findFirstOrThrow({
      where: { AND: [{ userId: this.UserId }, { id }] },
      select: null,
    });
    return await prisma.order.update({
      where: { id },
      select: {
        ...Order.DefaultSelect,
        customer: includeCustomer ? { select: Customer.DefaultSelect } : false,
      },
      data: { ...order, userId: this.UserId },
    });
  }
  public async Delete(id: number): Promise<void> {
    await prisma.order.findFirstOrThrow({
      where: { AND: [{ userId: this.UserId }, { id }] },
      select: null,
    });
    await prisma.order.delete({
      where: { id },
    });
  }
}

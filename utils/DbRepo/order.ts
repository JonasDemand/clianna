import { IOrder, IOrderWithCustomer } from '@customTypes/database/order';
import { PrismaClient } from '@prisma/client';

import { Customer } from './customer';

const prisma = new PrismaClient();

export class Order {
  public static DefaultSelect = {
    id: true,
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

  private UserCuid: string;
  public constructor(userCuid: string) {
    this.UserCuid = userCuid;
  }

  public async Create<IC extends boolean>(
    order: Omit<IOrderWithCustomer, 'id' | 'creationDate'>,
    includeCustomer: IC
  ): Promise<IC extends true ? IOrderWithCustomer : IOrder> {
    return await prisma.order.create({
      data: {
        ...order,
        creationDate: undefined,
        customer: order.customer?.id
          ? { connect: { id: order.customer.id } }
          : undefined,
        user: { connect: { cuid: this.UserCuid } },
      },
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
        AND: [
          { user: { cuid: this.UserCuid } },
          { OR: [{ customer: null }, { customer: { disabled: false } }] },
        ],
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
      where: { AND: [{ user: { cuid: this.UserCuid } }, { id }] },
      select: {
        ...Order.DefaultSelect,
        customer: includeCustomer ? { select: Customer.DefaultSelect } : false,
      },
    });
  }
  public async Update<IC extends boolean>(
    id: number,
    order: Omit<IOrderWithCustomer, 'id' | 'creationDate'>,
    includeCustomer: IC
  ): Promise<IC extends true ? IOrderWithCustomer : IOrder> {
    await prisma.order.findFirstOrThrow({
      where: { AND: [{ user: { cuid: this.UserCuid } }, { id }] },
      select: null,
    });
    return await prisma.order.update({
      where: { id },
      data: {
        ...order,
        creationDate: undefined,
        customer: order.customer?.id
          ? { connect: { id: order.customer.id } }
          : undefined,
        user: { connect: { cuid: this.UserCuid } },
      },
      select: {
        ...Order.DefaultSelect,
        customer: includeCustomer ? { select: Customer.DefaultSelect } : false,
      },
    });
  }
  public async Delete(id: number): Promise<void> {
    await prisma.order.findFirstOrThrow({
      where: { AND: [{ user: { cuid: this.UserCuid } }, { id }] },
      select: null,
    });
    await prisma.order.delete({
      where: { id },
    });
  }
}

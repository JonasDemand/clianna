import { ICustomer, ICustomerWithOrders } from '@customTypes/database/customer';
import { PrismaClient } from '@prisma/client';

import { Order } from './order';

const prisma = new PrismaClient();

export class Customer {
  public static DefaultSelect = {
    id: true,
    firstname: true,
    lastname: true,
    email: true,
    street: true,
    streetnumber: true,
    city: true,
    postalcode: true,
    phone: true,
    mobile: true,
    whatsapp: true,
    shoesize: true,
    disabled: true,
  };

  private UserId: number;
  public constructor(userId: number) {
    this.UserId = userId;
  }

  public async Create<IO extends boolean>(
    customer: Omit<ICustomer, 'id' | 'userId'>,
    includeOrders: IO
  ): Promise<IO extends true ? ICustomerWithOrders : ICustomer> {
    return await prisma.customer.create({
      data: { ...customer, userId: this.UserId },
      select: {
        ...Customer.DefaultSelect,
        orders: includeOrders ? { select: Order.DefaultSelect } : false,
      },
    });
  }
  public async GetAll<IO extends boolean>(
    includeOrders: IO
  ): Promise<IO extends true ? ICustomerWithOrders[] : ICustomer[]> {
    return await prisma.customer.findMany({
      where: { userId: this.UserId },
      select: {
        ...Customer.DefaultSelect,
        orders: includeOrders
          ? { where: { pending: true }, select: Order.DefaultSelect }
          : false,
      },
    });
  }
  public async GetActive<IO extends boolean>(
    includeOrders: IO
  ): Promise<IO extends true ? ICustomerWithOrders[] : ICustomer[]> {
    return await prisma.customer.findMany({
      where: { AND: [{ userId: this.UserId }, { disabled: false }] },
      select: {
        ...Customer.DefaultSelect,
        orders: includeOrders ? { select: Order.DefaultSelect } : false,
      },
    });
  }
  public async GetSingle<IO extends boolean>(
    id: number,
    includeOrders: IO
  ): Promise<(IO extends true ? ICustomerWithOrders : ICustomer) | null> {
    return await prisma.customer.findFirst({
      where: { AND: [{ userId: this.UserId }, { id }] },
      select: {
        ...Customer.DefaultSelect,
        orders: includeOrders ? { select: Order.DefaultSelect } : false,
      },
    });
  }
  public async Update<IO extends boolean>(
    id: number,
    customer: Omit<ICustomer, 'id'>,
    includeOrders: IO
  ): Promise<IO extends true ? ICustomerWithOrders : ICustomer> {
    await prisma.customer.findFirstOrThrow({
      where: { AND: [{ userId: this.UserId }, { id }] },
      select: null,
    });
    return await prisma.customer.update({
      where: { id },
      select: {
        ...Customer.DefaultSelect,
        orders: includeOrders ? { select: Order.DefaultSelect } : false,
      },
      data: { ...customer, userId: this.UserId },
    });
  }
  public async Delete(id: number): Promise<void> {
    await prisma.customer.findFirstOrThrow({
      where: { AND: [{ userId: this.UserId }, { id }] },
      select: null,
    });
    await prisma.customer.delete({
      where: { id },
    });
  }
}

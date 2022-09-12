import { ICustomer, ICustomerWithOrders } from '@customTypes/database/customer';
import { IUpsertRequest } from '@customTypes/messages/customer';
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

  private UserId: string;
  public constructor(userId: string) {
    this.UserId = userId;
  }

  public async Create<IO extends boolean>(
    customer: Omit<ICustomer, 'id'>,
    includeOrders: IO
  ): Promise<IO extends true ? ICustomerWithOrders : ICustomer> {
    return await prisma.customer.create({
      data: { ...customer, orders: {}, user: { connect: { id: this.UserId } } },
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
      where: { user: { id: this.UserId } },
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
      where: { AND: [{ user: { id: this.UserId } }, { disabled: false }] },
      select: {
        ...Customer.DefaultSelect,
        orders: includeOrders ? { select: Order.DefaultSelect } : false,
      },
    });
  }
  public async GetSingle<IO extends boolean>(
    id: string,
    includeOrders: IO
  ): Promise<(IO extends true ? ICustomerWithOrders : ICustomer) | null> {
    return await prisma.customer.findFirst({
      where: { AND: [{ user: { id: this.UserId } }, { id }] },
      select: {
        ...Customer.DefaultSelect,
        orders: includeOrders ? { select: Order.DefaultSelect } : false,
      },
    });
  }
  public async Update<IO extends boolean>(
    id: string,
    customer: IUpsertRequest,
    includeOrders: IO
  ): Promise<IO extends true ? ICustomerWithOrders : ICustomer> {
    await prisma.customer.findFirstOrThrow({
      where: { AND: [{ user: { id: this.UserId } }, { id }] },
      select: null,
    });
    return await prisma.customer.update({
      where: { id },
      select: {
        ...Customer.DefaultSelect,
        orders: includeOrders ? { select: Order.DefaultSelect } : false,
      },
      data: { ...customer, orders: {}, user: { connect: { id: this.UserId } } },
    });
  }
  public async Delete(id: string): Promise<void> {
    await prisma.customer.findFirstOrThrow({
      where: { AND: [{ user: { id: this.UserId } }, { id }] },
      select: null,
    });
    await prisma.customer.delete({
      where: { id },
    });
  }
}

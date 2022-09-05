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

  private UserCuid: string;
  public constructor(userCuid: string) {
    this.UserCuid = userCuid;
  }

  public async Create<IO extends boolean>(
    customer: Omit<ICustomer, 'id'>,
    includeOrders: IO
  ): Promise<IO extends true ? ICustomerWithOrders : ICustomer> {
    return await prisma.customer.create({
      data: { ...customer, user: { connect: { cuid: this.UserCuid } } },
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
      where: { user: { cuid: this.UserCuid } },
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
      where: { AND: [{ user: { cuid: this.UserCuid } }, { disabled: false }] },
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
      where: { AND: [{ user: { cuid: this.UserCuid } }, { id }] },
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
      where: { AND: [{ user: { cuid: this.UserCuid } }, { id }] },
      select: null,
    });
    return await prisma.customer.update({
      where: { id },
      select: {
        ...Customer.DefaultSelect,
        orders: includeOrders ? { select: Order.DefaultSelect } : false,
      },
      data: { ...customer, user: { connect: { cuid: this.UserCuid } } },
    });
  }
  public async Delete(id: number): Promise<void> {
    await prisma.customer.findFirstOrThrow({
      where: { AND: [{ user: { cuid: this.UserCuid } }, { id }] },
      select: null,
    });
    await prisma.customer.delete({
      where: { id },
    });
  }
}

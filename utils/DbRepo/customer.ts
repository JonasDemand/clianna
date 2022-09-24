import {
  ICustomer,
  ICustomerWithDependencies,
} from '@customTypes/database/customer';
import { IUpsertRequest } from '@customTypes/messages/customer';
import { PrismaClient } from '@prisma/client';

import { Document } from './document';
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

  public async Create<ID extends boolean>(
    customer: IUpsertRequest,
    includeDependencies: ID
  ): Promise<ID extends true ? ICustomerWithDependencies : ICustomer> {
    return await prisma.customer.create({
      data: {
        ...customer,
        orders: {},
        documents: {},
        user: { connect: { id: this.UserId } },
      },
      select: {
        ...Customer.DefaultSelect,
        orders: includeDependencies ? { select: Order.DefaultSelect } : false,
        documents: includeDependencies
          ? { select: Document.DefaultSelect }
          : false,
      },
    });
  }
  public async GetAll<ID extends boolean>(
    includeDependencies: ID
  ): Promise<ID extends true ? ICustomerWithDependencies[] : ICustomer[]> {
    return await prisma.customer.findMany({
      where: { user: { id: this.UserId } },
      select: {
        ...Customer.DefaultSelect,
        orders: includeDependencies
          ? { where: { pending: true }, select: Order.DefaultSelect }
          : false,
        documents: includeDependencies
          ? { select: Document.DefaultSelect }
          : false,
      },
    });
  }
  public async GetActive<ID extends boolean>(
    includeDependencies: ID
  ): Promise<ID extends true ? ICustomerWithDependencies[] : ICustomer[]> {
    return await prisma.customer.findMany({
      where: { AND: [{ user: { id: this.UserId } }, { disabled: false }] },
      select: {
        ...Customer.DefaultSelect,
        orders: includeDependencies ? { select: Order.DefaultSelect } : false,
        documents: includeDependencies
          ? { select: Document.DefaultSelect }
          : false,
      },
    });
  }
  public async GetSingle<ID extends boolean>(
    id: string,
    includeDependencies: ID
  ): Promise<(ID extends true ? ICustomerWithDependencies : ICustomer) | null> {
    return await prisma.customer.findFirst({
      where: { AND: [{ user: { id: this.UserId } }, { id }] },
      select: {
        ...Customer.DefaultSelect,
        orders: includeDependencies ? { select: Order.DefaultSelect } : false,
        documents: includeDependencies
          ? { select: Document.DefaultSelect }
          : false,
      },
    });
  }
  public async Update<ID extends boolean>(
    id: string,
    customer: IUpsertRequest,
    includeDependencies: ID
  ): Promise<ID extends true ? ICustomerWithDependencies : ICustomer> {
    await prisma.customer.findFirstOrThrow({
      where: { AND: [{ user: { id: this.UserId } }, { id }] },
      select: null,
    });
    return await prisma.customer.update({
      where: { id },
      select: {
        ...Customer.DefaultSelect,
        orders: includeDependencies ? { select: Order.DefaultSelect } : false,
        documents: includeDependencies
          ? { select: Document.DefaultSelect }
          : false,
      },
      data: {
        ...customer,
        orders: {},
        documents: {},
        user: { connect: { id: this.UserId } },
      },
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

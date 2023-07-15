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
    fibu: true,
    salutation: true,
    comment: true,
  };

  public static async Create<ID extends boolean>(
    customer: IUpsertRequest,
    includeDependencies: ID
  ): Promise<ID extends true ? ICustomerWithDependencies : ICustomer> {
    const existPromises: Array<Promise<any>> = [];
    if (customer.orders)
      existPromises.concat(
        customer.orders.map((x) =>
          prisma.order.findFirstOrThrow({
            where: {
              id: x.id,
            },
            select: null,
          })
        )
      );
    if (customer.documents)
      existPromises.concat(
        customer.documents.map((x) =>
          prisma.document.findFirstOrThrow({
            where: { id: x.id },
            select: null,
          })
        )
      );
    await Promise.all(existPromises);

    return await prisma.customer.create({
      data: {
        ...customer,
        id: undefined,
        orders: {
          connect: customer.orders?.map((x) => ({ id: x.id ?? '' })),
        },
        documents: {
          connect: customer.documents?.map((x) => ({ id: x.id ?? '' })),
        },
      },
      select: {
        ...Customer.DefaultSelect,
        orders: includeDependencies
          ? { select: { ...Order.DefaultSelect, documents: true } }
          : false,
        documents: includeDependencies
          ? { select: Document.DefaultSelect }
          : false,
      },
    });
  }
  public static async GetOnlyMeta() {
    return await prisma.customer.findMany({
      select: { firstname: true, lastname: true, id: true, disabled: true },
    });
  }
  public static async GetAll<ID extends boolean>(
    includeDependencies: ID
  ): Promise<ID extends true ? ICustomerWithDependencies[] : ICustomer[]> {
    return await prisma.customer.findMany({
      select: {
        ...Customer.DefaultSelect,
        orders: includeDependencies
          ? {
              select: { ...Order.DefaultSelect, documents: true },
            }
          : false,
        documents: includeDependencies
          ? { select: Document.DefaultSelect }
          : false,
      },
    });
  }
  public static async GetActive<ID extends boolean>(
    includeDependencies: ID
  ): Promise<ID extends true ? ICustomerWithDependencies[] : ICustomer[]> {
    return await prisma.customer.findMany({
      where: { disabled: false },
      select: {
        ...Customer.DefaultSelect,
        orders: includeDependencies
          ? { select: { ...Order.DefaultSelect, documents: true } }
          : false,
        documents: includeDependencies
          ? { select: Document.DefaultSelect }
          : false,
      },
    });
  }
  public static async GetSingle<ID extends boolean>(
    id: string,
    includeDependencies: ID
  ): Promise<(ID extends true ? ICustomerWithDependencies : ICustomer) | null> {
    return await prisma.customer.findFirst({
      where: { id },
      select: {
        ...Customer.DefaultSelect,
        orders: includeDependencies
          ? { select: { ...Order.DefaultSelect, documents: true } }
          : false,
        documents: includeDependencies
          ? { select: Document.DefaultSelect }
          : false,
      },
    });
  }
  public static async Update<ID extends boolean>(
    id: string,
    customer: IUpsertRequest,
    includeDependencies: ID
  ): Promise<ID extends true ? ICustomerWithDependencies : ICustomer> {
    const existPromises: Array<Promise<any>> = [
      prisma.customer.findFirstOrThrow({
        where: { id },
        select: null,
      }),
    ];
    if (customer.orders)
      existPromises.concat(
        customer.orders.map((x) =>
          prisma.order.findFirstOrThrow({
            where: {
              id: x.id,
            },
            select: null,
          })
        )
      );
    if (customer.documents)
      existPromises.concat(
        customer.documents.map((x) =>
          prisma.document.findFirstOrThrow({
            where: {
              AND: { id: x.id },
            },
            select: null,
          })
        )
      );
    await Promise.all(existPromises);

    return await prisma.customer.update({
      where: { id },
      select: {
        ...Customer.DefaultSelect,
        orders: includeDependencies
          ? { select: { ...Order.DefaultSelect, documents: true } }
          : false,
        documents: includeDependencies
          ? { select: Document.DefaultSelect }
          : false,
      },
      data: {
        ...customer,
        id: undefined,
        orders: {
          connect: customer.orders?.map((x) => ({ id: x.id ?? '' })),
        },
        documents: {
          connect: customer.documents?.map((x) => ({ id: x.id ?? '' })),
        },
      },
    });
  }
  public static async Delete(id: string): Promise<void> {
    await prisma.customer.findFirstOrThrow({
      where: { id },
      select: null,
    });
    await prisma.customer.delete({
      where: { id },
    });
  }
}

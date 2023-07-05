import { IOrder, IOrderWithDependencies } from '@customTypes/database/order';
import { IUpsertRequest } from '@customTypes/messages/order';
import { PrismaClient } from '@prisma/client';

import { Customer } from './customer';
import { Document } from './document';

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

  private UserId: string;
  public constructor(userId: string) {
    this.UserId = userId;
  }

  public async Create<ID extends boolean>(
    order: IUpsertRequest,
    includeDependencies: ID
  ): Promise<ID extends true ? IOrderWithDependencies : IOrder> {
    const existPromises: Array<Promise<any>> = [];
    if (order.customer?.id)
      existPromises.push(
        prisma.customer.findFirstOrThrow({
          where: { id: order.customer?.id },
          select: null,
        })
      );
    if (order.documents)
      existPromises.concat(
        order.documents.map((x) =>
          prisma.document.findFirstOrThrow({
            where: { id: x.id },
            select: null,
          })
        )
      );
    await Promise.all(existPromises);

    return await prisma.order.create({
      data: {
        ...order,
        customer: order.customer?.id
          ? { connect: { id: order.customer.id } }
          : undefined,
        documents: {
          connect: order.documents?.map((x) => ({ id: x.id ?? '' })),
        },
        id: undefined,
        creationDate: undefined,
      },
      select: {
        ...Order.DefaultSelect,
        customer: includeDependencies
          ? { select: Customer.DefaultSelect }
          : false,
        documents: includeDependencies
          ? { select: Document.DefaultSelect }
          : false,
      },
    });
  }
  public async GetAll<ID extends boolean>(
    includeDependencies: ID
  ): Promise<ID extends true ? IOrderWithDependencies[] : IOrder[]> {
    return await prisma.order.findMany({
      select: {
        ...Order.DefaultSelect,
        customer: includeDependencies
          ? { select: Customer.DefaultSelect }
          : false,
        documents: includeDependencies
          ? { select: Document.DefaultSelect }
          : false,
      },
    });
  }
  public async GetSingle<ID extends boolean>(
    id: string,
    includeDependencies: ID
  ): Promise<(ID extends true ? IOrderWithDependencies : IOrder) | null> {
    return await prisma.order.findFirst({
      where: { id },
      select: {
        ...Order.DefaultSelect,
        customer: includeDependencies
          ? { select: Customer.DefaultSelect }
          : false,
        documents: includeDependencies
          ? { select: Document.DefaultSelect }
          : false,
      },
    });
  }
  public async Update<ID extends boolean>(
    id: string,
    order: IUpsertRequest,
    includeDependencies: ID
  ): Promise<ID extends true ? IOrderWithDependencies : IOrder> {
    const existPromises: Array<Promise<any>> = [
      prisma.order.findFirstOrThrow({
        where: { id },
        select: null,
      }),
    ];
    if (order.customer?.id)
      existPromises.push(
        prisma.customer.findFirstOrThrow({
          where: { id: order.customer?.id },
          select: null,
        })
      );
    if (order.documents)
      existPromises.concat(
        order.documents.map((x) =>
          prisma.document.findFirstOrThrow({
            where: { id: x.id },
            select: null,
          })
        )
      );
    await Promise.all(existPromises);

    return await prisma.order.update({
      where: { id },
      data: {
        ...order,
        customer: order.customer?.id
          ? { connect: { id: order.customer.id } }
          : undefined,
        documents: {
          connect: order.documents?.map((x) => ({ id: x.id ?? '' })),
        },
        id: undefined,
        creationDate: undefined,
      },
      select: {
        ...Order.DefaultSelect,
        customer: includeDependencies
          ? { select: Customer.DefaultSelect }
          : false,
        documents: includeDependencies
          ? { select: Document.DefaultSelect }
          : false,
      },
    });
  }
  public async Delete(id: string): Promise<void> {
    await prisma.order.findFirstOrThrow({
      where: { id },
      select: null,
    });
    await prisma.order.delete({
      where: { id },
    });
  }
}

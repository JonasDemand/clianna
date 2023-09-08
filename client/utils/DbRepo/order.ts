import { IOrder, IOrderWithDependencies } from '@customTypes/database/order';
import { IUpsertRequest } from '@customTypes/messages/order';

import { DbRepo } from '.';
import { Customer } from './customer';
import { Document } from './document';

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
    brand: true,
    article: true,
    color: true,
    dealer: true,
    size: true,
    name: true,
  };

  public static async Create<ID extends boolean>(
    order: IUpsertRequest,
    includeDependencies: ID
  ): Promise<ID extends true ? IOrderWithDependencies : IOrder> {
    return await DbRepo.Client.order.create({
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
  public static async GetAll<ID extends boolean>(
    includeDependencies: ID
  ): Promise<ID extends true ? IOrderWithDependencies[] : IOrder[]> {
    return await DbRepo.Client.order.findMany({
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
  public static async GetSingle<ID extends boolean>(
    id: string,
    includeDependencies: ID
  ): Promise<(ID extends true ? IOrderWithDependencies : IOrder) | null> {
    return await DbRepo.Client.order.findFirst({
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
  public static async Update<ID extends boolean>(
    id: string,
    order: IUpsertRequest,
    includeDependencies: ID
  ): Promise<ID extends true ? IOrderWithDependencies : IOrder> {
    return await DbRepo.Client.order.update({
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
  public static async Delete(id: string): Promise<void> {
    await DbRepo.Client.order.delete({
      where: { id },
    });
  }
}

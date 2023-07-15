import {
  ICustomer,
  ICustomerWithDependencies,
} from '@customTypes/database/customer';
import { IUpsertRequest } from '@customTypes/messages/customer';

import { DbRepo } from '.';
import { Document } from './document';
import { Order } from './order';

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
    return await DbRepo.Client.customer.create({
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
    return await DbRepo.Client.customer.findMany({
      select: { firstname: true, lastname: true, id: true, disabled: true },
    });
  }
  public static async GetAll<ID extends boolean>(
    includeDependencies: ID
  ): Promise<ID extends true ? ICustomerWithDependencies[] : ICustomer[]> {
    return await DbRepo.Client.customer.findMany({
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
    return await DbRepo.Client.customer.findMany({
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
    return await DbRepo.Client.customer.findFirst({
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
    return await DbRepo.Client.customer.update({
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
    await DbRepo.Client.customer.delete({
      where: { id },
    });
  }
}

import {
  IDocument,
  IDocumentWithDependencies,
} from '@customTypes/database/document';
import { IUpsertRequest } from '@customTypes/messages/document';

import { DbRepo } from '.';
import { Customer } from './customer';
import { Order } from './order';

export class Document {
  public static DefaultSelect = {
    id: true,
    googleId: true,
    name: true,
    template: true,
    creationDate: true,
    incrementalId: true,
  };

  public static async Create<ID extends boolean>(
    document: IUpsertRequest,
    includeDependencies: ID
  ): Promise<ID extends true ? IDocumentWithDependencies : IDocument> {
    return await DbRepo.Client.document.create({
      data: {
        ...document,
        customer: document.customer?.id
          ? { connect: { id: document.customer.id } }
          : undefined,
        order: document.order?.id
          ? { connect: { id: document.order.id } }
          : undefined,
        id: undefined,
      },
      select: {
        ...Document.DefaultSelect,
        order: includeDependencies
          ? { select: { ...Order.DefaultSelect, customer: true } }
          : false,
        customer: includeDependencies
          ? { select: { ...Customer.DefaultSelect, orders: true } }
          : false,
      },
    });
  }
  public static async GetAll<ID extends boolean>(
    includeDependencies: ID
  ): Promise<ID extends true ? IDocumentWithDependencies[] : IDocument[]> {
    return await DbRepo.Client.document.findMany({
      select: {
        ...Document.DefaultSelect,
        order: includeDependencies
          ? { select: { ...Order.DefaultSelect, customer: true } }
          : false,
        customer: includeDependencies
          ? { select: { ...Customer.DefaultSelect, orders: true } }
          : false,
      },
    });
  }
  public static async GetSingle<ID extends boolean>(
    id: string,
    includeDependencies: ID
  ): Promise<(ID extends true ? IDocumentWithDependencies : IDocument) | null> {
    return await DbRepo.Client.document.findFirst({
      where: { id },
      select: {
        ...Document.DefaultSelect,
        order: includeDependencies
          ? { select: { ...Order.DefaultSelect, customer: true } }
          : false,
        customer: includeDependencies
          ? { select: { ...Customer.DefaultSelect, orders: true } }
          : false,
      },
    });
  }
  public static async GetTemplates(): Promise<IDocument[]> {
    return await DbRepo.Client.document.findMany({
      where: { template: true },
      select: Document.DefaultSelect,
    });
  }
  public static async Update<ID extends boolean>(
    id: string,
    document: IUpsertRequest,
    includeDependencies: ID
  ): Promise<ID extends true ? IDocumentWithDependencies : IDocument> {
    return await DbRepo.Client.document.update({
      where: { id },
      select: {
        ...Document.DefaultSelect,
        order: includeDependencies
          ? { select: { ...Order.DefaultSelect, customer: true } }
          : false,
        customer: includeDependencies
          ? { select: { ...Customer.DefaultSelect, orders: true } }
          : false,
      },
      data: {
        ...document,
        customer: document.customer?.id
          ? { connect: { id: document.customer.id } }
          : undefined,
        order: document.order?.id
          ? { connect: { id: document.order.id } }
          : undefined,
        id: undefined,
      },
    });
  }
  public static async Delete(id: string): Promise<void> {
    await DbRepo.Client.document.delete({
      where: { id },
    });
  }
}

import {
  IDocument,
  IDocumentWithDependencies,
} from '@customTypes/database/document';
import { IUpsertRequest } from '@customTypes/messages/document';
import { PrismaClient } from '@prisma/client';

import { Customer } from './customer';
import { Order } from './order';

const prisma = new PrismaClient();

export class Document {
  public static DefaultSelect = {
    id: true,
    googleId: true,
    name: true,
    template: true,
  };

  public static async Create<ID extends boolean>(
    document: IUpsertRequest,
    includeDependencies: ID
  ): Promise<ID extends true ? IDocumentWithDependencies : IDocument> {
    return await prisma.document.create({
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
    return await prisma.document.findMany({
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
    return await prisma.document.findFirst({
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
  public static async GetTemplates<ID extends boolean>(
    includeDependencies: ID
  ): Promise<ID extends true ? IDocumentWithDependencies[] : IDocument[]> {
    return await prisma.document.findMany({
      where: { template: true },
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
  public static async Update<ID extends boolean>(
    id: string,
    document: IUpsertRequest,
    includeDependencies: ID
  ): Promise<ID extends true ? IDocumentWithDependencies : IDocument> {
    await prisma.document.findFirstOrThrow({
      where: { id },
      select: null,
    });
    return await prisma.document.update({
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
    await prisma.document.findFirstOrThrow({
      where: { id },
      select: null,
    });
    await prisma.document.delete({
      where: { id },
    });
  }
}

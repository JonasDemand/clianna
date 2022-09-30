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

  private UserId: string;
  public constructor(userId: string) {
    this.UserId = userId;
  }

  public async Create<ID extends boolean>(
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
        user: { connect: { id: this.UserId } },
      },
      select: {
        ...Document.DefaultSelect,
        order: includeDependencies ? { select: Order.DefaultSelect } : false,
        customer: includeDependencies
          ? { select: Customer.DefaultSelect }
          : false,
      },
    });
  }
  public async GetAll<ID extends boolean>(
    includeDependencies: ID
  ): Promise<ID extends true ? IDocumentWithDependencies[] : IDocument[]> {
    return await prisma.document.findMany({
      where: { user: { id: this.UserId } },
      select: {
        ...Document.DefaultSelect,
        order: includeDependencies ? { select: Order.DefaultSelect } : false,
        customer: includeDependencies
          ? { select: Customer.DefaultSelect }
          : false,
      },
    });
  }
  public async GetSingle<ID extends boolean>(
    id: string,
    includeDependencies: ID
  ): Promise<(ID extends true ? IDocumentWithDependencies : IDocument) | null> {
    return await prisma.document.findFirst({
      where: { AND: [{ user: { id: this.UserId } }, { id }] },
      select: {
        ...Document.DefaultSelect,
        order: includeDependencies ? { select: Order.DefaultSelect } : false,
        customer: includeDependencies
          ? { select: Customer.DefaultSelect }
          : false,
      },
    });
  }
  public async Update<ID extends boolean>(
    id: string,
    document: IUpsertRequest,
    includeDependencies: ID
  ): Promise<ID extends true ? IDocumentWithDependencies : IDocument> {
    await prisma.document.findFirstOrThrow({
      where: { AND: [{ user: { id: this.UserId } }, { id }] },
      select: null,
    });
    return await prisma.document.update({
      where: { id },
      select: {
        ...Document.DefaultSelect,
        order: includeDependencies ? { select: Order.DefaultSelect } : false,
        customer: includeDependencies
          ? { select: Customer.DefaultSelect }
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
        user: { connect: { id: this.UserId } },
      },
    });
  }
  public async Delete(id: string): Promise<void> {
    await prisma.document.findFirstOrThrow({
      where: { AND: [{ user: { id: this.UserId } }, { id }] },
      select: null,
    });
    await prisma.document.delete({
      where: { id },
    });
  }
}

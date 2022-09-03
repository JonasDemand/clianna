import { ICustomerWithOrders } from '@customTypes/database/customer';
import { Customer as PrismaCustomer, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Customer {
  private UserId: number;
  public constructor(userId: number) {
    this.UserId = userId;
  }

  public async Create<IO extends boolean>(
    customer: Omit<PrismaCustomer, 'id'>,
    includeOrders: IO
  ): Promise<IO extends true ? ICustomerWithOrders : PrismaCustomer> {
    return await prisma.customer.create({
      data: customer,
      include: { orders: !!includeOrders },
    });
  }
  public async GetAll<IO extends boolean>(
    includeOrders: IO
  ): Promise<IO extends true ? ICustomerWithOrders[] : PrismaCustomer[]> {
    return await prisma.customer.findMany({
      include: { orders: includeOrders ? { where: { pending: true } } : false },
    });
  }
  public async GetActive<IO extends boolean>(
    includeOrders: IO
  ): Promise<IO extends true ? ICustomerWithOrders[] : PrismaCustomer[]> {
    return await prisma.customer.findMany({
      where: { disabled: false },
      include: { orders: !!includeOrders },
    });
  }
  public async GetSingle<IO extends boolean>(
    id: number,
    includeOrders: IO
  ): Promise<(IO extends true ? ICustomerWithOrders : PrismaCustomer) | null> {
    return await prisma.customer.findUnique({
      where: { id },
      include: { orders: !!includeOrders },
    });
  }
  public async Update<IO extends boolean>(
    id: number,
    customer: Omit<PrismaCustomer, 'id'>,
    includeOrders: IO
  ): Promise<IO extends true ? ICustomerWithOrders : PrismaCustomer> {
    return await prisma.customer.update({
      where: { id },
      include: { orders: !!includeOrders },
      data: customer,
    });
  }
  public async Delete(id: number): Promise<void> {
    await prisma.customer.delete({
      where: { id },
    });
  }
}

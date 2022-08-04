import { ICustomerWithOrders } from '@customTypes/database/customer';
import { Customer as PrismaCustomer, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Customer {
  public async Create(
    customer: Omit<PrismaCustomer, 'id'>
  ): Promise<ICustomerWithOrders> {
    return await prisma.customer.create({
      data: customer,
      include: { orders: true },
    });
  }
  public async Update(
    id: number,
    customer: Omit<PrismaCustomer, 'id'>
  ): Promise<ICustomerWithOrders> {
    return await prisma.customer.update({
      where: { id },
      include: { orders: true },
      data: customer,
    });
  }
  public async Delete() {
    throw new Error('not Implemented');
  }
  public async GetAll(): Promise<ICustomerWithOrders[]> {
    return await prisma.customer.findMany({
      include: { orders: { where: { pending: true } } },
    });
  }
  public async GetActive(): Promise<PrismaCustomer[]> {
    return await prisma.customer.findMany({
      where: { disabled: false },
    });
  }
  public async GetSingle(id: number): Promise<ICustomerWithOrders | null> {
    return await prisma.customer.findUnique({
      where: { id },
      include: { orders: true },
    });
  }
}

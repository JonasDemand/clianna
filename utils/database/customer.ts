import { Customer as PrismaCustomer, PrismaClient } from '@prisma/client';

import { ICustomerWithOrders } from '../../@types/database/customer';

const prisma = new PrismaClient();

export class Customer {
  public async Create(
    customer: Omit<PrismaCustomer, 'id'>
  ): Promise<ICustomerWithOrders> {
    const createdCustomer = await prisma.customer.create({
      data: customer,
      include: { orders: true },
    });
    return {
      ...createdCustomer,
      openOrders: createdCustomer.orders.filter((order) => order.pending)
        .length,
    };
  }
  public async Update(
    id: number,
    customer: Omit<PrismaCustomer, 'id'>
  ): Promise<ICustomerWithOrders> {
    const updatedCustomer = await prisma.customer.update({
      where: { id },
      include: { orders: true },
      data: customer,
    });
    return {
      ...updatedCustomer,
      openOrders: updatedCustomer.orders.filter((order) => order.pending)
        .length,
    };
  }
  public async Delete() {}
  public async GetAll(): Promise<ICustomerWithOrders[]> {
    const customers = await prisma.customer.findMany({
      include: { orders: true },
    });
    return customers.map<ICustomerWithOrders>((customer) => ({
      ...customer,
      openOrders: customer.orders.filter((order) => order.pending).length,
    }));
  }
  public async GetSingle(id: number): Promise<ICustomerWithOrders | null> {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { orders: true },
    });
    if (!customer) return null;
    return {
      ...customer,
      openOrders: customer.orders.filter((order) => order.pending).length,
    };
  }
}

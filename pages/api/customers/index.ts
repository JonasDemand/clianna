import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import process, { Implementations } from '../../../utils/api/process';
import { ICustomerWithOrders } from '../../../@types/customer';

const prisma = new PrismaClient();

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const customers = await prisma.customer.findMany({
    include: { orders: true },
  });
  res.status(200).json(
    customers.map<ICustomerWithOrders>((customer) => ({
      ...customer,
      openOrders: customer.orders.filter((order) => order.pending).length,
    }))
  );
};

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    id: _,
    openOrders: __,
    orders: ___,
    ...body
  } = JSON.parse(req.body) as ICustomerWithOrders;
  if (!body) {
    res.status(400).send(null);
    return;
  }
  const customer = await prisma.customer.create({
    data: { ...body },
    include: { orders: true },
  });
  if (customer == null) {
    res.status(404).send(null);
    return;
  }
  res.status(200).json({
    ...customer,
    openOrders: customer.orders.filter((order) => order.pending).length,
  });
};

const implementations: Implementations = {
  GET: get,
  POST: post,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  process(req, res, implementations, false);
};

export default handler;

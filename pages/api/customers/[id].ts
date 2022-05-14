import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { ICustomerWithOrders } from '../../../@types/customer';
import processApi, { Implementations } from '../../../utils/api/processApi';

const prisma = new PrismaClient();

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const parsedId = parseInt(id.toString(), 10);
  if (isNaN(parsedId)) {
    res.status(404).send(null);
    return;
  }
  const customer = await prisma.customer.findUnique({
    where: { id: parsedId },
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

const put = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const parsedId = parseInt(id.toString(), 10);
  if (isNaN(parsedId)) {
    res.status(404).send(null);
    return;
  }
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
  const customer = await prisma.customer.update({
    where: { id: parsedId },
    include: { orders: true },
    data: { ...body },
  });
  await res.unstable_revalidate('/customers');
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
  PUT: put,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  processApi(req, res, implementations, false);
};

export default handler;

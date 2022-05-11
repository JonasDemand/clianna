import type { NextApiRequest, NextApiResponse } from 'next';
import { Customer, PrismaClient } from '@prisma/client';
import process, { Implementations } from '../../../utils/api/process';
import { ICustomerWithOrders } from '../../../@types/customer';

const prisma = new PrismaClient();

interface CustomerRequest extends NextApiRequest {}
interface CustomerResponse extends NextApiResponse<Customer | null> {}

const get = async (req: CustomerRequest, res: CustomerResponse) => {
  const { id } = req.query;
  const parsedId = parseInt(id.toString(), 10);
  if (isNaN(parsedId)) {
    res.status(404).send(null);
    return;
  }
  const customer = await prisma.customer.findUnique({
    where: { id: parsedId },
    include: { oders: true },
  });
  if (customer == null) {
    res.status(404).send(null);
    return;
  }
  res.status(200).json(customer);
};

const put = async (req: CustomerRequest, res: CustomerResponse) => {
  const { id } = req.query;
  const parsedId = parseInt(id.toString(), 10);
  if (isNaN(parsedId)) {
    res.status(404).send(null);
    return;
  }
  const body = JSON.parse(req.body) as Customer;
  if (!body) {
    res.status(400).send(null);
    return;
  }
  const customer = await prisma.customer.update({
    where: { id: parsedId },
    data: body,
  });
  if (customer == null) {
    res.status(404).send(null);
    return;
  }
  res.status(200).json(customer);
};

const implementations: Implementations<CustomerRequest, CustomerResponse> = {
  GET: get,
  PUT: put,
};

const handler = async (req: CustomerRequest, res: CustomerResponse) => {
  process<CustomerRequest, CustomerResponse>(req, res, implementations, false);
};

export default handler;

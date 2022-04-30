import type { NextApiRequest, NextApiResponse } from 'next';
import { Customer, PrismaClient } from '@prisma/client';
import process, { Implementations } from '../../../utils/api/process';

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

const implementations: Implementations<CustomerRequest, CustomerResponse> = {
  GET: get,
};

const handler = async (req: CustomerRequest, res: CustomerResponse) => {
  process<CustomerRequest, CustomerResponse>(req, res, implementations, false);
};

export default handler;

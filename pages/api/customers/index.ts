import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import process, { Implementations } from '../../../utils/api/process';

const prisma = new PrismaClient();

interface CustomersRequest extends NextApiRequest {}
interface CustomersResponse extends NextApiResponse {}

const get = async (_: CustomersRequest, res: CustomersResponse) => {
  const customers = await prisma.customer.findMany({
    include: { oders: true },
  });
  res.status(200).json(customers);
};

const implementations: Implementations<CustomersRequest, CustomersResponse> = {
  GET: get,
};

const handler = async (req: CustomersRequest, res: CustomersResponse) => {
  process<CustomersRequest, CustomersResponse>(
    req,
    res,
    implementations,
    false
  );
};

export default handler;

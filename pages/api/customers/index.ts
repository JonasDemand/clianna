import type { NextApiRequest, NextApiResponse } from 'next';
import { Customer, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Customer[]>
) => {
  const customers = await prisma.customer.findMany();
  res.status(200).json(customers);
};

export default handler;

import type { NextApiRequest, NextApiResponse } from 'next';
import { Customer, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Customer[] | null>
) => {
  switch (req.method) {
    case 'GET':
      const customers = await prisma.customer.findMany({
        include: { oders: true },
      });
      res.status(200).json(customers);
      break;
    default:
      res.status(404).send(null);
      break;
  }
};

export default handler;

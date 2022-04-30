import type { NextApiRequest, NextApiResponse } from 'next';
import { Customer, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Customer | null>
) => {
  switch (req.method) {
    case 'GET':
      const { id } = req.query;
      const parsedId = parseInt(id.toString(), 10);
      if (isNaN(parsedId)) {
        res.status(404).send(null);
        break;
      }
      const customer = await prisma.customer.findUnique({
        where: { id: parsedId },
        include: { oders: true },
      });
      if (customer == null) {
        res.status(404).send(null);
        break;
      }
      res.status(200).json(customer);
      break;
    default:
      res.status(404).send(null);
      break;
  }
};

export default handler;

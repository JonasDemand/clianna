import type { NextApiRequest, NextApiResponse } from 'next';
import { Customer, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Customer | null>
) => {
  const { id } = req.query;
  const parsedId = parseInt(id.toString(), 10);
  if (isNaN(parsedId)) {
    res.status(400).send(null);
    return;
  }
  const customer = await prisma.customer.findUnique({
    where: { id: parsedId },
    include: { Order: true },
  });
  if (customer == null) {
    res.status(404).send(null);
    return;
  }
  res.status(200).json(customer);
};

export default handler;

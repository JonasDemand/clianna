import { IUpsertRequest } from '@customTypes/messages/customer';
import {
  withAuth,
  withBody,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/middleware';
import { DbRepo } from '@utils/DbRepo';
import type { NextApiRequest, NextApiResponse } from 'next';

const createCustomers = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as IUpsertRequest[];

  const customers = await Promise.all(
    body.map((customer) => DbRepo.Customer.Create(customer, true))
  );

  res.revalidate('/customers');
  return res.status(200).send(customers);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toUpperCase()) {
    case 'POST':
      await withMiddleware(withBody(), createCustomers)(req, res);
  }
};

export default withMiddleware(withMethodGuard(['POST']), withAuth, handler);

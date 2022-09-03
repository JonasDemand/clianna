import { Customer } from '@prisma/client';
import {
  withAuth,
  withBody,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/implementation/middleware';
import { DbRepo } from '@utils/DbRepo';
import type { NextApiRequest, NextApiResponse } from 'next';

const getCustomers = async (req: NextApiRequest, res: NextApiResponse) => {
  const customers = await DbRepo.Current.Customer.GetAll(true);
  if (!customers) return res.status(500).send('Unable to retrieve customers');
  res.status(200).send(customers);
};

const createCustomer = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id: _, ...body } = req.body as Customer;

  const customer = await DbRepo.Current.Customer.Create(body, true);
  if (!customer) return res.status(500).send('Unable to create customer');

  res.status(200).send(customer);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toUpperCase() ?? 'GET') {
    case 'GET':
      await getCustomers(req, res);
    case 'POST':
      await withMiddleware(withBody(), createCustomer)(req, res);
  }
};

export default withMiddleware(
  withMethodGuard(['GET', 'POST']),
  withAuth(false),
  handler
);

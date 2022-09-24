import { IUpsertRequest } from '@customTypes/messages/customer';
import {
  withAuth,
  withBody,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/middleware';
import { DbRepo } from '@utils/DbRepo';
import type { NextApiRequest, NextApiResponse } from 'next';

const getCustomers = async (req: NextApiRequest, res: NextApiResponse) => {
  const customers = await DbRepo.Instance.Customer.GetAll(true);
  if (!customers) return res.status(500).send('Unable to retrieve customers');
  res.status(200).send(customers);
};

const createCustomer = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as IUpsertRequest;

  const customer = await DbRepo.Instance.Customer.Create(body, true);
  if (!customer) return res.status(500).send('Unable to create customer');

  res.status(200).send(customer);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toUpperCase()) {
    case 'GET':
      await getCustomers(req, res);
    case 'POST':
      await withMiddleware(withBody(), createCustomer)(req, res);
  }
};

export default withMiddleware(
  withMethodGuard(['GET', 'POST']),
  withAuth,
  handler
);

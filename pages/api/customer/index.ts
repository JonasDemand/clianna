import { IUpsertRequest } from '@customTypes/messages/customer';
import { Revalidate } from '@utils/api/client/revalidate';
import {
  withAuth,
  withBody,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/middleware';
import { environment } from '@utils/config';
import { DbRepo } from '@utils/DbRepo';
import type { NextApiRequest, NextApiResponse } from 'next';

const getCustomers = async (req: NextApiRequest, res: NextApiResponse) => {
  const customers = await DbRepo.Customer.GetAll(true);
  if (!customers) return res.status(500).send('Unable to retrieve customers');
  return res.status(200).send(customers);
};

const createCustomer = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as IUpsertRequest;
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  const customer = await DbRepo.Customer.Create(body, true);
  if (!customer) return res.status(500).send('Unable to create customer');

  Revalidate.Post(
    { secret: environment.SECRET, paths: ['/customers'] },
    baseUrl
  );
  return res.status(200).send(customer);
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

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

const createCustomers = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as IUpsertRequest[];
  const baseUrl = `${req.headers['x-forwarded-proto']}://${req.headers.host}/`;

  const customers = await Promise.all(
    body.map((customer) => DbRepo.Customer.Create(customer, true))
  );

  Revalidate.Post(environment.SECRET, { paths: ['/customers'] }, baseUrl);
  return res.status(200).send(customers);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toUpperCase()) {
    case 'POST':
      await withMiddleware(withBody(), createCustomers)(req, res);
  }
};

export default withMiddleware(withMethodGuard(['POST']), withAuth, handler);

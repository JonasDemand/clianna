import { defaultRevalidatePaths } from '@consts/api';
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
  const protocol = req.headers['x-forwarded-proto'] ?? 'http';
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  const customers = await Promise.all(
    body.map((customer) => DbRepo.Customer.Create(customer, true))
  );

  Revalidate.Post(
    {
      secret: environment.SECRET,
      paths: defaultRevalidatePaths,
    },
    baseUrl
  );
  return res.status(200).send(customers);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toUpperCase()) {
    case 'POST':
      await withMiddleware(withBody(), createCustomers)(req, res);
  }
};

export default withMiddleware(withMethodGuard(['POST']), withAuth, handler);

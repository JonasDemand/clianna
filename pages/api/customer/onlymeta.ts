import {
  withAuth,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/middleware';
import { DbRepo } from '@utils/DbRepo';
import type { NextApiRequest, NextApiResponse } from 'next';

const getCustomersOnlyMeta = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const customers = await DbRepo.Customer.GetOnlyMeta();
  if (!customers) return res.status(500).send('Unable to retrieve customers');
  return res.status(200).send(customers);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toUpperCase()) {
    case 'GET':
      await getCustomersOnlyMeta(req, res);
  }
};

export default withMiddleware(withMethodGuard(['GET']), withAuth, handler);

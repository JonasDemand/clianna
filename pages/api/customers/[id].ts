import { Customer } from '@prisma/client';
import {
  withAuth,
  withBody,
  withMethodGuard,
  withMiddleware,
  withQueryParameter,
} from '@utils/api/implementation/middleware';
import { Db } from '@utils/database';
import { NextApiRequest, NextApiResponse } from 'next';

const getCustomer = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const parsedId = parseInt(id.toString(), 10);

  const customer = await Db.Customer.GetSingle(parsedId);
  if (!customer) return res.status(404).send('Unable to retrieve customer');

  res.status(200).send(customer);
};

const updateCustomer = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const parsedId = parseInt(id.toString(), 10);
  const { id: _, ...body } = req.body as Customer;

  const customer = await Db.Customer.Update(parsedId, body);
  if (!customer) return res.status(500).send('Unable to update customer');

  res.status(200).send(customer);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toUpperCase()) {
    case 'GET':
      await getCustomer(req, res);
    case 'PUT':
      await withMiddleware(withBody(), updateCustomer)(req, res);
  }
};

export default withMiddleware(
  withAuth(false),
  withMethodGuard(['GET', 'PUT']),
  withQueryParameter('id'),
  handler
);

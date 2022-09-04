import { ICustomer } from '@customTypes/database/customer';
import {
  withAuth,
  withBody,
  withMethodGuard,
  withMiddleware,
  withQueryParameter,
} from '@utils/api/implementation/middleware';
import { DbRepo } from '@utils/DbRepo';
import { NextApiRequest, NextApiResponse } from 'next';

const getCustomer = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const parsedId = parseInt(id.toString(), 10);

  const customer = await DbRepo.Current.Customer.GetSingle(parsedId, true);
  if (!customer) return res.status(404).send('Unable to retrieve customer');

  res.status(200).send(customer);
};

const updateCustomer = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const parsedId = parseInt(id.toString(), 10);
  const { id: _, ...body } = req.body as ICustomer;

  const customer = await DbRepo.Current.Customer.Update(parsedId, body, true);
  if (!customer) return res.status(500).send('Unable to update customer');

  res.status(200).send(customer);
};

const deleteCustomer = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const parsedId = parseInt(id.toString(), 10);

  await DbRepo.Current.Customer.Delete(parsedId);
  return res.status(200).send('Deletion of customer successful');
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toUpperCase()) {
    case 'GET':
      await getCustomer(req, res);
      break;
    case 'PUT':
      await withMiddleware(withBody(), updateCustomer)(req, res);
      break;
    case 'DELETE':
      await deleteCustomer(req, res);
      break;
  }
};

export default withMiddleware(
  withAuth,
  withMethodGuard(['GET', 'PUT', 'DELETE']),
  withQueryParameter('id'),
  handler
);

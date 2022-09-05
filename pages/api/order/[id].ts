import { IOrderWithCustomer } from '@customTypes/database/order';
import {
  withAuth,
  withBody,
  withMethodGuard,
  withMiddleware,
  withQueryParameters,
} from '@utils/api/middleware';
import { DbRepo } from '@utils/DbRepo';
import { NextApiRequest, NextApiResponse } from 'next';

const getOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const parsedId = parseInt(id!.toString(), 10);

  const order = await DbRepo.Instance.Order.GetSingle(parsedId, true);
  if (!order) return res.status(404).send('Unable to retrieve order');

  res.status(200).send(order);
};

const updateOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const parsedId = parseInt(id!.toString(), 10);
  const { id: _, ...body } = req.body as IOrderWithCustomer;

  const customer = await DbRepo.Instance.Order.Update(parsedId, body, true);
  if (!customer) return res.status(500).send('Unable to update customer');
  res.status(200).send(body);
};

const deleteOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const parsedId = parseInt(id!.toString(), 10);

  await DbRepo.Instance.Order.Delete(parsedId);
  return res.status(200).send('Deletion of order successful');
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toUpperCase()) {
    case 'GET':
      await getOrder(req, res);
      break;
    case 'PUT':
      await withMiddleware(withBody(), updateOrder)(req, res);
      break;
    case 'DELETE':
      await deleteOrder(req, res);
      break;
  }
};

export default withMiddleware(
  withAuth,
  withMethodGuard(['GET', 'PUT', 'DELETE']),
  withQueryParameters([{ name: 'id', isNumber: true }]),
  handler
);

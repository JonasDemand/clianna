import { IOrder } from '@customTypes/database/order';
import {
  withAuth,
  withBody,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/implementation/middleware';
import { DbRepo } from '@utils/DbRepo';
import type { NextApiRequest, NextApiResponse } from 'next';

const getOrders = async (req: NextApiRequest, res: NextApiResponse) => {
  const orders = await DbRepo.Current.Order.GetAll(true);
  if (!orders) return res.status(500).send('Unable to retrieve orders');
  res.status(200).send(orders);
};

const createOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id: _, ...body } = req.body as IOrder;

  const order = await DbRepo.Current.Order.Create(body, true);
  if (!order) return res.status(500).send('Unable to create order');

  res.status(200).send(order);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toUpperCase() ?? 'GET') {
    case 'GET':
      await getOrders(req, res);
      break;
    case 'POST':
      await withMiddleware(withBody(), createOrder)(req, res);
      break;
  }
};

export default withMiddleware(
  withMethodGuard(['GET', 'POST']),
  withAuth(false),
  handler
);

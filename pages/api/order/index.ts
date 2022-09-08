import { IOrderWithCustomer } from '@customTypes/database/order';
import {
  withAuth,
  withBody,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/middleware';
import { DbRepo } from '@utils/DbRepo';
import type { NextApiRequest, NextApiResponse } from 'next';

const getOrders = async (req: NextApiRequest, res: NextApiResponse) => {
  const orders = await DbRepo.Instance.Order.GetAll(true);
  if (!orders) return res.status(500).send('Unable to retrieve orders');
  res.status(200).send(orders);
};

const createOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id: _, ...body } = req.body as IOrderWithCustomer;

  const order = await DbRepo.Instance.Order.Create(body, true);
  if (!order) return res.status(500).send('Unable to create order');

  res.status(200).send(order);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toUpperCase()) {
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
  withAuth,
  handler
);

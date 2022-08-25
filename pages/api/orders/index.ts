import { Order } from '@prisma/client';
import {
  withAuth,
  withBody,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/implementation/middleware';
import { Db } from '@utils/database';
import type { NextApiRequest, NextApiResponse } from 'next';

const getOrders = async (req: NextApiRequest, res: NextApiResponse) => {
  const orders = await Db.Order.GetAll(true);
  if (!orders) return res.status(500).send('Unable to retrieve orders');
  res.status(200).send(orders);
};

const createOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id: _, ...body } = req.body as Order;

  const order = await Db.Order.Create(body, true);
  if (!order) return res.status(500).send('Unable to create order');

  res.status(200).send(order);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toUpperCase() ?? 'GET') {
    case 'GET':
      await getOrders(req, res);
    case 'POST':
      await withMiddleware(withBody(), createOrder)(req, res);
  }
};

export default withMiddleware(
  withMethodGuard(['GET', 'POST']),
  withAuth(false),
  handler
);

import { Order } from '@prisma/client';
import {
  withAuth,
  withBody,
  withMethodGuard,
  withMiddleware,
  withQueryParameter,
} from '@utils/api/implementation/middleware';
import { Db } from '@utils/database';
import { NextApiRequest, NextApiResponse } from 'next';

const getOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const parsedId = parseInt(id.toString(), 10);

  const order = await Db.Order.GetSingle(parsedId, true);
  if (!order) return res.status(404).send('Unable to retrieve order');

  res.status(200).send(order);
};

const updateOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const parsedId = parseInt(id.toString(), 10);
  const { id: _, ...body } = req.body as Order;

  const customer = await Db.Order.Update(parsedId, body, true);
  if (!customer) return res.status(500).send('Unable to update customer');

  res.status(200).send(customer);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toUpperCase()) {
    case 'GET':
      await getOrder(req, res);
    case 'PUT':
      await withMiddleware(withBody(), updateOrder)(req, res);
  }
};

export default withMiddleware(
  withAuth(false),
  withMethodGuard(['GET', 'PUT']),
  withQueryParameter('id'),
  handler
);

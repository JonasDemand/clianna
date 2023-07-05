import { IUpsertRequest } from '@customTypes/messages/order';
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

const getOrders = async (req: NextApiRequest, res: NextApiResponse) => {
  const orders = await DbRepo.Order.GetAll(true);
  if (!orders) return res.status(500).send('Unable to retrieve orders');
  res.status(200).send(orders);
};

const createOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as IUpsertRequest;
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}/`;

  const order = await DbRepo.Order.Create(body, true);
  if (!order) return res.status(500).send('Unable to create order');

  Revalidate.Post(
    environment.SECRET,
    { paths: ['/orders', '/customers'] },
    baseUrl
  );
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

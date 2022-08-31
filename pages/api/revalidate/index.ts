import { Routes } from '@customTypes/revalidate';
import {
  withAuth,
  withBody,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/implementation/middleware';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const request = req.body as Routes;
  if (!request.routes || !request.routes.length)
    return res.status(400).send('There has to be at least one route');
  await Promise.all(
    request.routes.map(async (route) => await res.unstable_revalidate(route))
  );
  res.status(200).send('Revalidation of routes successful');
};

export default withMiddleware(
  withMethodGuard(['POST']),
  withAuth(false),
  withBody(['routes']),
  handler
);

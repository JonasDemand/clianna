import {
  withAuth,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/implementation/middleware';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await res.unstable_revalidate('/orders');
    return res.status(200).send('Revalidation successful');
  } catch {
    return res.status(500).send('Error revalidating');
  }
};

export default withMiddleware(
  withMethodGuard(['POST']),
  withAuth(false),
  handler
);

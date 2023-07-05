import { IRevalidateRequest } from '@customTypes/messages/revalidate';
import {
  withBody,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/middleware';
import { environment } from '@utils/config';
import type { NextApiRequest, NextApiResponse } from 'next';

const revalidate = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as IRevalidateRequest;

  console.log({ body, secret: environment.SECRET });

  if (body.secret !== environment.SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    const promises = body.paths.map((path) => res.revalidate(path));
    await Promise.all(promises);
    return res.status(200).send('Revalidation successful');
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toLocaleUpperCase()) {
    case 'POST':
      withMiddleware(withBody(['secret', 'paths']), revalidate)(req, res);
      break;
  }
};

export default withMiddleware(withMethodGuard(['POST']), handler);

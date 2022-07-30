import {
  withAuth,
  withBody,
  withMiddleware,
} from '@utils/api/implementation/middleware';
import { Db } from '@utils/database';
import type { NextApiRequest, NextApiResponse } from 'next';

const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const createResponse = await Db.User.Create({ ...req.body });

  if (!createResponse) return res.status(500).send('Unable to create user');

  return res.status(200).send({
    email: createResponse.email,
    admin: createResponse.admin,
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toLocaleUpperCase() ?? 'GET') {
    case 'POST':
      withMiddleware(withBody(['email', 'password']), createUser)(req, res);
  }
};

export default withMiddleware(withAuth(true), handler);

import { withBody, withMiddleware } from '@utils/api/implementation/middleware';
import { DbRepo } from '@utils/DbRepo';
import type { NextApiRequest, NextApiResponse } from 'next';

const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const createResponse = await DbRepo.Current.User.Create({ ...req.body });

  if (!createResponse) return res.status(500).send('Unable to create user');

  return res.status(200).send({
    email: createResponse.email,
    admin: createResponse.admin,
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toLocaleUpperCase()) {
    case 'POST':
      withMiddleware(withBody(['email', 'password']), createUser)(req, res);
      break;
  }
};

export default handler;

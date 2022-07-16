import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

import { withAuth } from '../../../utils/api/implementation/middleware/withAuth';
import { withBody } from '../../../utils/api/implementation/middleware/withBody';
import { withMiddleware } from '../../../utils/api/implementation/middleware/withMiddleware';
import Db from '../../../utils/database';

const prisma = new PrismaClient();

const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const createResponse = await Db.User.Create({ ...req.body });

  if (!createResponse.user) {
    res.status(400).send(createResponse.error);
    return;
  }
  res
    .status(200)
    .send({
      email: createResponse.user.email,
      admin: createResponse.user.admin,
    });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toLocaleUpperCase() ?? 'GET') {
    case 'POST':
      withMiddleware(
        withAuth(true),
        withBody(['email', 'password']),
        createUser
      )(req, res);
  }
};

export default handler;

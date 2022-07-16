import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { hashPassword } from '../../../authentication';

const prisma = new PrismaClient();

export const withAuth =
  (adminRequired: boolean) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    let isAdmin = false;
    if (!session) {
      if (
        !req.headers.authorization ||
        !req.headers.authorization?.includes('Basic')
      ) {
        return res
          .status(401)
          .send('Unauthorized: Use session or authorization header');
      }
      const base64Credentials = req.headers.authorization.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString(
        'ascii'
      );
      const [email, password] = credentials.split(':');
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (user === null) {
        return res.status(401).send('Incorrect user or password');
      }
      const hash = await hashPassword(password, user.salt);
      if (hash !== user.password) {
        return res.status(401).end('Incorrect user or password');
      }
      isAdmin = user.admin;
    } else {
      isAdmin = session.user.admin;
    }
    if (adminRequired && !isAdmin) {
      return res.status(403).end('Admin rights required');
    }
  };

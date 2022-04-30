import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../../utils/authentication';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      if (
        !req.headers['content-type']
          ?.toLocaleLowerCase()
          .includes('application/json')
      ) {
        res.status(400).send(null);
        break;
      }
      if (
        !req.headers.authorization ||
        !req.headers.authorization.includes('Basic ')
      ) {
        res.status(401).send(null);
        break;
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
        res.status(404).send(null);
        break;
      }
      const hash = await hashPassword(password, user.salt);
      if (hash === user.password) res.status(200).send(null);
      else res.status(403).send(null);
      break;
    default:
      res.status(404).send(null);
      break;
  }
};

export default handler;

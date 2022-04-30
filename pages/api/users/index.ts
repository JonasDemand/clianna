import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, User } from '@prisma/client';
import { createSalt, hashPassword } from '../../../utils/authentication';

const prisma = new PrismaClient();

interface CreateUserRequest extends NextApiRequest {
  body: Omit<User, 'id' | 'salt'>;
}

const handler = async (
  req: CreateUserRequest,
  res: NextApiResponse<User[] | null>
) => {
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
      if (!req.body.email || !req.body.password) {
        res.status(400).send(null);
        break;
      }
      const salt = createSalt();
      const hashedPassword = await hashPassword(req.body.password, salt);
      await prisma.user.create({
        data: {
          email: req.body.email,
          password: hashedPassword,
          salt: salt,
          admin: req.body.admin ?? false,
        },
      });
      res.status(200).send(null);
      break;
    default:
      res.status(404).send(null);
      break;
  }
};

export default handler;

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, User } from '@prisma/client';
import { createSalt, hashPassword } from '../../../utils/authentication';
import processApi, { Implementations } from '../../../utils/api/processApi';

const prisma = new PrismaClient();

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  if (
    !req.headers['content-type']
      ?.toLocaleLowerCase()
      .includes('application/json')
  ) {
    res.status(400).send(null);
    return;
  }
  if (!req.body.email || !req.body.password) {
    res.status(400).send(null);
    return;
  }
  const existingUsersCount = await prisma.user.count({
    where: {
      email: req.body.email,
    },
  });
  if (existingUsersCount) {
    res.status(400).send(null);
    return;
  }
  const salt = createSalt();
  const hashedPassword = await hashPassword(req.body.password, salt);
  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      password: hashedPassword,
      salt: salt,
      admin: Boolean(req.body.admin) ?? false,
    },
  });
  res.status(200).send({ email: user.email, admin: user.admin });
};

const implementations: Implementations = {
  POST: post,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  processApi(req, res, implementations, true);
};

export default handler;

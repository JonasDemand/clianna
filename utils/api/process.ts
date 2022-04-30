import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { hashPassword } from '../authentication';

const prisma = new PrismaClient();

export type Implementations<T, G> = Record<
  string,
  (req: T, res: G) => Promise<void>
>;

const authorized = async <T extends NextApiRequest, G extends NextApiResponse>(
  req: T,
  res: G,
  adminRequired?: boolean
): Promise<boolean> => {
  const session = await getSession({ req });
  let isAdmin = false;
  if (!session) {
    if (
      !req.headers.authorization ||
      !req.headers.authorization?.includes('Basic')
    ) {
      res.status(401).send(null);
      return false;
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
      res.status(401).send(null);
      return false;
    }
    const hash = await hashPassword(password, user.salt);
    if (hash !== user.password) {
      res.status(401).send(null);
      return false;
    }
    isAdmin = user.admin;
  } else {
    isAdmin = session.user.admin;
  }
  if (adminRequired && !isAdmin) {
    res.status(403).send(null);
    return false;
  }
  return true;
};

const process = async <T extends NextApiRequest, G extends NextApiResponse>(
  req: T,
  res: G,
  implementations: Implementations<T, G>,
  adminRequired?: boolean
) => {
  if (!(await authorized(req, res, adminRequired))) return;
  const implementation = implementations[req.method?.toUpperCase() ?? 'GET'];
  if (implementation)
    try {
      await implementation(req, res);
    } catch {
      res.status(500).send(null);
    }
  else res.status(405).send(null);
};

export default process;

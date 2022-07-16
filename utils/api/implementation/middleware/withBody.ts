import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export const withBody =
  (requiredAttributes: string[]) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (
      !req.headers['content-type']
        ?.toLocaleLowerCase()
        .includes('application/json')
    ) {
      res.status(400).send('Expected content-type application/json');
      return;
    }
    if (!req.body) {
      res.status(400).end();
      return;
    }
    requiredAttributes.forEach((attribute) => {
      if (!req.body[attribute]) {
        res.status(400).send(`Expected body json attribute '${attribute}'`);
        return;
      }
    });
  };

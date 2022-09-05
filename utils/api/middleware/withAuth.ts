import { DbRepo } from '@utils/DbRepo';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export const withAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('This method needs authorization');
  }
  DbRepo.Init(session.user.cuid);
};

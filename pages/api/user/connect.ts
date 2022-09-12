import { ICredentailsRequest } from '@customTypes/messages/user';
import {
  withAuth,
  withBody,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/middleware';
import { DbRepo } from '@utils/DbRepo';
import { User } from '@utils/DbRepo/user';
import type { NextApiRequest, NextApiResponse } from 'next';

const connectUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as ICredentailsRequest;

  const newUserId = await DbRepo.Instance.User.GetIdFromEmail(body.email);
  const newUserRepo = new User(newUserId);

  const isValid = await newUserRepo.ValidateCredentials(body.password);
  if (!isValid) return res.status(403).send('Authentication failed');

  await DbRepo.Instance.User.MigrateFromId(newUserId);

  return res.status(200).send('Succesfully connected users');
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toLocaleUpperCase()) {
    case 'POST':
      connectUsers(req, res);
      break;
  }
};

export default withMiddleware(
  withMethodGuard(['POST']),
  withBody(['email', 'password']),
  withAuth,
  handler
);

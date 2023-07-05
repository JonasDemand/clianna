import { ICredentailsRequest } from '@customTypes/messages/user';
import {
  withBody,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/middleware';
import { DbRepo } from '@utils/DbRepo';
import type { NextApiRequest, NextApiResponse } from 'next';

const createCredentials = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as ICredentailsRequest;

  await DbRepo.User.Create(body);
  return res.status(200).send('Succesfully created credentials');
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toLocaleUpperCase()) {
    case 'POST':
      withMiddleware(withBody(['email', 'password']), createCredentials)(
        req,
        res
      );
      break;
  }
};

export default withMiddleware(
  withMethodGuard(['POST']),
  withBody(['email']),
  handler
);

import { IUpsertCredentialsRequest } from '@customTypes/user';
import {
  withBody,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/middleware';
import { DbRepo } from '@utils/DbRepo';
import type { NextApiRequest, NextApiResponse } from 'next';

const upsertCredentials = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as IUpsertCredentialsRequest;

  await DbRepo.Instance.User.UpsertCredentials(body);
  return res.status(200).send('Succesfully created credentials');
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toLocaleUpperCase()) {
    case 'POST':
      withMiddleware(withBody(['email', 'password']), upsertCredentials)(
        req,
        res
      );
      break;
  }
};

export default withMiddleware(withMethodGuard(['POST']), handler);

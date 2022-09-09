import { IUpdateUserRequest } from '@customTypes/messages/user';
import {
  withAuth,
  withBody,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/middleware';
import { DbRepo } from '@utils/DbRepo';
import type { NextApiRequest, NextApiResponse } from 'next';

const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as IUpdateUserRequest;

  await DbRepo.Instance.User.Update(body);
  return res.status(200).send('User successfully updated');
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toLocaleUpperCase()) {
    case 'PUT':
      updateUser(req, res);
      break;
  }
};

export default withMiddleware(
  withMethodGuard(['PUT']),
  withBody(),
  withAuth,
  handler
);

import { IUpdateRequest } from '@customTypes/messages/user';
import {
  withAuth,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/middleware';
import { DbRepo } from '@utils/DbRepo';
import type { NextApiRequest, NextApiResponse } from 'next';

const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as IUpdateRequest;

  if (body.password) {
    const isValid = await DbRepo.Instance.User.ValidateCredentials(
      body.oldPassword ?? ''
    );
    if (!isValid) return res.status(403).send('Authentication failed');
  }

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

export default withMiddleware(withMethodGuard(['PUT']), withAuth, handler);

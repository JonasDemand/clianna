import { IUpdateRequest } from '@customTypes/messages/user';
import {
  withAuth,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/middleware';
import { DbRepo } from '@utils/DbRepo';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as IUpdateRequest;
  const session = await getSession({ req });

  if (body.password) {
    const isValid = await DbRepo.User.ValidateCredentials(
      body.email ?? '',
      body.oldPassword ?? ''
    );
    if (!isValid) return res.status(403).send('Authentication failed');
  }

  await DbRepo.User.Update(session!.user.id, body);
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

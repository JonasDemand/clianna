import {
  withAuth,
  withMethodGuard,
  withMiddleware,
  withQueryParameters,
} from '@utils/api/middleware';
import { DbRepo } from '@utils/DbRepo';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const validateCredentials = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { password } = req.query;
  const session = await getSession({ req });

  const isValid = await DbRepo.User.ValidateCredentials(
    session?.user.email ?? '',
    password!.toString()
  );

  return res.status(200).send({ valid: isValid });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toLocaleUpperCase()) {
    case 'GET':
      withMiddleware(
        withQueryParameters([{ name: 'password', isNumber: false }]),
        validateCredentials
      )(req, res);
      break;
  }
};

export default withMiddleware(withMethodGuard(['GET']), withAuth, handler);

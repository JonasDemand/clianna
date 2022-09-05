import {
  withMethodGuard,
  withMiddleware,
  withQueryParameters,
} from '@utils/api/middleware';
import { DbRepo } from '@utils/DbRepo';
import type { NextApiRequest, NextApiResponse } from 'next';

const validateEmail = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.query;

  const users = await DbRepo.Instance.User.GetAll();
  const emails = users.map((user) => user.email);

  return res
    .status(200)
    .send({ valid: emails.findIndex((x) => x === email) === -1 });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toLocaleUpperCase()) {
    case 'GET':
      withMiddleware(
        withQueryParameters([{ name: 'email', isNumber: false }]),
        validateEmail
      )(req, res);
      break;
  }
};

export default withMiddleware(withMethodGuard(['GET']), handler);

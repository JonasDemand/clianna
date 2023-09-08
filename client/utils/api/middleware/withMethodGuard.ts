import { NextApiRequest, NextApiResponse } from 'next';

export const withMethodGuard =
  (allowedMethods: string[]) => (req: NextApiRequest, res: NextApiResponse) => {
    if (!allowedMethods.includes(req.method?.toUpperCase() ?? ''))
      return res.status(405).send(`Method '${req.method} not allowed'`);
  };

import { NextApiRequest, NextApiResponse } from 'next';

export const withQueryParameter =
  (name: string) => async (req: NextApiRequest, res: NextApiResponse) => {
    const parameter = req.query[name];
    const parsedParameter = parseInt(parameter.toString(), 10);
    if (isNaN(parsedParameter)) {
      return res.status(404).send('Unable to read query parameter');
    }
  };

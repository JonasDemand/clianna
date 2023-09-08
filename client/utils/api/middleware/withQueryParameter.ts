import { NextApiRequest, NextApiResponse } from 'next';

export const withQueryParameters =
  (parameters: { name: string; isNumber: boolean }[]) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    parameters.forEach((parameter) => {
      const stringParameter = req.query[parameter.name];
      if (!stringParameter)
        return res.status(404).send('Unable to read query parameter');
      if (!parameter.isNumber) return;
      const parsedParameter = parseInt(stringParameter.toString(), 10);
      if (!parsedParameter || isNaN(parsedParameter)) {
        return res.status(404).send('Unable to read query parameter');
      }
    });
  };

import { NextApiRequest, NextApiResponse } from 'next';

export const withBody =
  (requiredAttributes?: string[]) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (
      !req.headers['content-type']
        ?.toLocaleLowerCase()
        .includes('application/json')
    )
      return res.status(400).send('Expected content-type application/json');

    if (!req.body) return res.status(400).end();

    if (requiredAttributes)
      requiredAttributes.forEach((attribute) => {
        if (!req.body[attribute]) {
          return res
            .status(400)
            .send(`Expected body json attribute '${attribute}'`);
        }
      });
  };

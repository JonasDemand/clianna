import type { NextApiRequest, NextApiResponse } from 'next';

import processApi, { Implementations } from '../../../utils/api/processApi';

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await res.unstable_revalidate('/customers');
    return res.status(200).send('Revalidation successful');
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
};

const implementations: Implementations = {
  POST: post,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  processApi(req, res, implementations, false);
};

export default handler;

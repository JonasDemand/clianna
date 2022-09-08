import {
  withAuth,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/middleware';
import { withGapi } from '@utils/api/middleware/withGapi';
import { GapiWrapper } from '@utils/gapi/GapiWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const createRootfolder = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const gapi = new GapiWrapper(session!.user.refreshToken!);
  try {
    const folder = await gapi.drive.files.create({});
  } catch {
    return res.status(500).send('upsi');
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toUpperCase()) {
    case 'POST':
      await withMiddleware(createRootfolder)(req, res);
  }
};

export default withMiddleware(
  withMethodGuard(['POST']),
  withAuth,
  withGapi(false),
  handler
);

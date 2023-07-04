import {
  withAuth,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/middleware';
import { withGapi } from '@utils/api/middleware/withGapi';
import { DbRepo } from '@utils/DbRepo';
import { GapiWrapper } from '@utils/gapi/GapiWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const createRootfolder = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const gapi = new GapiWrapper();
  const folder = await gapi.drive.files.create({
    requestBody: {
      name: `Clianna_${session!.user.id}`,
      mimeType: 'application/vnd.google-apps.folder',
    },
  });
  const cliannaFolderId = folder.data.id;
  if (!cliannaFolderId)
    return res.status(500).send('Google Drive API didnt return any ID');
  DbRepo.Instance.User.Update({ cliannaFolderId });

  await fetch(
    `${process.env.NEXTAUTH_URL}/api/auth/session?refreshSession=true`
  );

  return res.status(200).send({ cliannaFolderId });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toUpperCase()) {
    case 'POST':
      await createRootfolder(req, res);
  }
};

export default withMiddleware(
  withMethodGuard(['POST']),
  withAuth,
  withGapi(false),
  handler
);

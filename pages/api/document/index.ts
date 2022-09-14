import {
  withAuth,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/middleware';
import { withGapi } from '@utils/api/middleware/withGapi';
import { GapiWrapper } from '@utils/gapi/GapiWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const createDocument = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const gapi = new GapiWrapper(session!.user.refreshToken!);
  const document = await gapi.drive.files.create({
    requestBody: {
      name: `Clianna_${session!.user.id}`,
      mimeType: 'application/vnd.google-apps.document',
      parents: [session!.user.cliannaFolderId!],
    },
  });
  const documentId = document.data.id;
  if (!documentId)
    return res.status(500).send('Google Drive API didnt return any ID');
  return res.status(200).send({ id: documentId });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toUpperCase()) {
    case 'POST':
      await createDocument(req, res);
  }
};

export default withMiddleware(
  withMethodGuard(['POST']),
  withAuth,
  withGapi(true),
  handler
);

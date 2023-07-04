import { IUpsertRequest } from '@customTypes/messages/document';
import {
  withAuth,
  withBody,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/middleware';
import { withGapi } from '@utils/api/middleware/withGapi';
import { DbRepo } from '@utils/DbRepo';
import { GapiWrapper } from '@utils/gapi/GapiWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const createDocument = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as IUpsertRequest;
  const initialDocument = await DbRepo.Instance.Document.Create(body, false);

  const session = await getSession({ req });
  const gapi = new GapiWrapper();

  const driveResponse = await gapi.drive.files.create({
    requestBody: {
      name: initialDocument.id,
      mimeType: 'application/vnd.google-apps.document',
      parents: [session!.user.cliannaFolderId!],
    },
  });
  const updatedDocument = await DbRepo.Instance.Document.Update(
    initialDocument.id ?? '',
    { googleId: driveResponse.data.id },
    false
  );

  return res.status(200).send(updatedDocument);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toUpperCase()) {
    case 'POST':
      await createDocument(req, res);
  }
};

export default withMiddleware(
  withMethodGuard(['POST']),
  withBody(['name']),
  withAuth,
  withGapi(true),
  handler
);

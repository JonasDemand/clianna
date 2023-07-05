import { IUpsertRequest } from '@customTypes/messages/document';
import {
  withAuth,
  withBody,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/middleware';
import { withGapi } from '@utils/api/middleware/withGapi';
import { environment } from '@utils/config';
import { DbRepo } from '@utils/DbRepo';
import { GapiWrapper } from '@utils/gapi/GapiWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';

const createDocument = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body as IUpsertRequest;
  const initialDocument = await DbRepo.Document.Create(body, false);

  const gapi = new GapiWrapper();

  const driveResponse = await gapi.drive.files.create({
    requestBody: {
      name: initialDocument.id,
      mimeType: 'application/vnd.google-apps.document',
      parents: [environment.GOOGLE_ROOT_FOLDER_ID],
    },
  });
  const updatedDocument = await DbRepo.Document.Update(
    initialDocument.id ?? '',
    { googleId: driveResponse.data.id },
    false
  );

  res.revalidate('/docuemnts');
  res.revalidate('/customers');
  res.revalidate('/orders');
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

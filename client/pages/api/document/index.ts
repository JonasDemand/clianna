import { IUpsertRequest } from '@customTypes/messages/document';
import {
  withAuth,
  withBody,
  withMethodGuard,
  withMiddleware,
} from '@utils/api/middleware';
import { environment } from '@utils/config';
import { DbRepo } from '@utils/DbRepo';
import { GapiWrapper } from '@utils/gapi/GapiWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';

const createDocument = async (req: NextApiRequest, res: NextApiResponse) => {
  const protocol = req.headers['x-forwarded-proto'] ?? 'http';
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;
  const body = req.body as IUpsertRequest;
  const initialDocument = await DbRepo.Document.Create(body, false);

  const driveResponse = await GapiWrapper.Instance.drive.files.create({
    requestBody: {
      name: initialDocument.id,
      mimeType: 'application/vnd.google-apps.document',
      parents: [environment.GOOGLE_DRIVE_ROOT_FOLDER],
    },
  });
  const updatedDocument = await DbRepo.Document.Update(
    initialDocument.id ?? '',
    { googleId: driveResponse.data.id },
    false
  );

  /*Revalidate.Post(
    {
      secret: environment.SECRET,
      paths: defaultRevalidatePaths,
    },
    baseUrl
  );*/
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
  handler
);
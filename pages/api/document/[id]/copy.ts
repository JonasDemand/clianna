import { IUpsertRequest } from '@customTypes/messages/document';
import { Revalidate } from '@utils/api/client/revalidate';
import {
  withAuth,
  withBody,
  withMethodGuard,
  withMiddleware,
  withQueryParameters,
} from '@utils/api/middleware';
import { withGapi } from '@utils/api/middleware/withGapi';
import { environment } from '@utils/config';
import { DbRepo } from '@utils/DbRepo';
import { GapiWrapper } from '@utils/gapi/GapiWrapper';
import { replaceTextFromObject } from '@utils/templating';
import { NextApiRequest, NextApiResponse } from 'next';

const copyDocument = async (req: NextApiRequest, res: NextApiResponse) => {
  const protocol = req.headers['x-forwarded-proto'] ?? 'http';
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;
  const { id } = req.query;
  const body = req.body as IUpsertRequest;

  const documentToCopy = await DbRepo.Document.GetSingle(id!.toString(), false);
  if (!documentToCopy) return res.status(404).send('Document not found');

  const initialDocument = await DbRepo.Document.Create(body, true);

  const gapi = new GapiWrapper();

  if (!documentToCopy.googleId) return res.status(200).send(initialDocument);

  const driveCreateResponse = await gapi.drive.files.copy({
    fileId: documentToCopy.googleId,
    requestBody: {
      name: initialDocument.id,
      parents: [environment.GOOGLE_ROOT_FOLDER_ID],
    },
  });
  const driveId = driveCreateResponse.data.id;
  if (!driveId) return res.status(500).send('Invalid gapi response');
  if (
    documentToCopy.template &&
    (initialDocument.customer || initialDocument.order)
  )
    await gapi.docs.documents.batchUpdate({
      documentId: driveId,
      requestBody: {
        requests: replaceTextFromObject(
          initialDocument.customer ? 'customer' : 'order',
          initialDocument.customer ?? initialDocument.order!
        ).map(({ replaceValue, replaceTemplate }) => ({
          replaceAllText: {
            containsText: { matchCase: false, text: replaceTemplate },
            replaceText: replaceValue,
          },
        })),
      },
    });
  const updatedDocument = await DbRepo.Document.Update(
    initialDocument.id ?? '',
    { googleId: driveId },
    false
  );

  Revalidate.Post(
    {
      secret: environment.SECRET,
      paths: ['/customers', '/docuemnts', '/orders'],
    },
    baseUrl
  );
  return res.status(200).send(updatedDocument);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toUpperCase()) {
    case 'POST':
      await copyDocument(req, res);
      break;
  }
};

export default withMiddleware(
  withMethodGuard(['POST']),
  withQueryParameters([{ name: 'id', isNumber: false }]),
  withBody(),
  withAuth,
  withGapi(true),
  handler
);

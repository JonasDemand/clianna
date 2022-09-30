import { IUpsertRequest } from '@customTypes/messages/document';
import {
  withAuth,
  withBody,
  withMethodGuard,
  withMiddleware,
  withQueryParameters,
} from '@utils/api/middleware';
import { withGapi } from '@utils/api/middleware/withGapi';
import { DbRepo } from '@utils/DbRepo';
import { GapiWrapper } from '@utils/gapi/GapiWrapper';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const copyDocument = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const body = req.body as IUpsertRequest;

  const documentToCopy = await DbRepo.Instance.Document.GetSingle(
    id!.toString(),
    false
  );
  if (!documentToCopy) return res.status(404).send('Document not found');

  const initialDocument = await DbRepo.Instance.Document.Create(body, false);

  const session = await getSession({ req });
  const gapi = new GapiWrapper(session!.user.refreshToken!);

  if (!documentToCopy.googleId) return res.status(200).send(initialDocument);

  const docsResponse = await gapi.drive.files.copy({
    fileId: documentToCopy.googleId,
    requestBody: {
      name: initialDocument.id,
      parents: [session!.user.cliannaFolderId!],
    },
  });
  const updatedDocument = await DbRepo.Instance.Document.Update(
    initialDocument.id ?? '',
    { googleId: docsResponse.data.id },
    false
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

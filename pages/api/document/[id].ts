import { IUpsertRequest } from '@customTypes/messages/document';
import {
  withAuth,
  withBody,
  withMethodGuard,
  withMiddleware,
  withQueryParameters,
} from '@utils/api/middleware';
import { DbRepo } from '@utils/DbRepo';
import { GapiWrapper } from '@utils/gapi/GapiWrapper';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const getDocument = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const document = await DbRepo.Instance.Document.GetSingle(
    id!.toString(),
    true
  );
  if (!document) return res.status(404).send('Unable to retrieve document');

  res.status(200).send(document);
};

const updateDocument = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const body = req.body as IUpsertRequest;

  const document = await DbRepo.Instance.Document.Update(
    id!.toString(),
    body,
    true
  );
  if (!document) return res.status(500).send('Unable to update document');

  res.status(200).send(document);
};

const deleteDocument = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const session = await getSession({ req });
  const gapi = new GapiWrapper(session!.user.refreshToken!);

  const document = await DbRepo.Instance.Document.GetSingle(
    id!.toString(),
    false
  );
  if (document?.googleId)
    gapi.drive.files.delete({ fileId: document?.googleId });

  await DbRepo.Instance.Document.Delete(id!.toString());
  return res.status(200).send('Deletion of document successful');
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toUpperCase()) {
    case 'GET':
      await getDocument(req, res);
      break;
    case 'PUT':
      await withMiddleware(withBody(), updateDocument)(req, res);
      break;
    case 'DELETE':
      await deleteDocument(req, res);
      break;
  }
};

export default withMiddleware(
  withMethodGuard(['GET', 'PUT', 'DELETE']),
  withQueryParameters([{ name: 'id', isNumber: false }]),
  withAuth,
  handler
);

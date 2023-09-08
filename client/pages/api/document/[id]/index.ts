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

const getDocument = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const document = await DbRepo.Document.GetSingle(id!.toString(), true);
  if (!document) return res.status(404).send('Unable to retrieve document');

  res.status(200).send(document);
};

const updateDocument = async (req: NextApiRequest, res: NextApiResponse) => {
  const protocol = req.headers['x-forwarded-proto'] ?? 'http';
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;
  const { id } = req.query;
  const body = req.body as IUpsertRequest;

  const document = await DbRepo.Document.Update(id!.toString(), body, true);
  if (!document) return res.status(500).send('Unable to update document');

  /*Revalidate.Post(
    {
      secret: environment.SECRET,
      paths: defaultRevalidatePaths,
    },
    baseUrl
  );*/
  res.status(200).send(document);
};

const deleteDocument = async (req: NextApiRequest, res: NextApiResponse) => {
  const protocol = req.headers['x-forwarded-proto'] ?? 'http';
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;
  const { id } = req.query;

  const document = await DbRepo.Document.GetSingle(id!.toString(), false);
  if (document?.googleId)
    GapiWrapper.Instance.drive.files.delete({ fileId: document?.googleId });

  await DbRepo.Document.Delete(id!.toString());

  /*Revalidate.Post(
    {
      secret: environment.SECRET,
      paths: defaultRevalidatePaths,
    },
    baseUrl
  );*/
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

import { defaultRevalidatePaths } from '@consts/api';
import { IUpsertRequest } from '@customTypes/messages/order';
import { Revalidate } from '@utils/api/client/revalidate';
import {
  withAuth,
  withBody,
  withMethodGuard,
  withMiddleware,
  withQueryParameters,
} from '@utils/api/middleware';
import { environment } from '@utils/config';
import { DbRepo } from '@utils/DbRepo';
import { GapiWrapper } from '@utils/gapi/GapiWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

const getOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const order = await DbRepo.Order.GetSingle(id!.toString(), true);
  if (!order) return res.status(404).send('Unable to retrieve order');

  return res.status(200).send(order);
};

const updateOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const protocol = req.headers['x-forwarded-proto'] ?? 'http';
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;
  const { id } = req.query;
  const body = req.body as IUpsertRequest;

  const customer = await DbRepo.Order.Update(id!.toString(), body, true);
  if (!customer) return res.status(500).send('Unable to update customer');

  Revalidate.Post(
    {
      secret: environment.SECRET,
      paths: defaultRevalidatePaths,
    },
    baseUrl
  );
  return res.status(200).send(body);
};

const deleteOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const protocol = req.headers['x-forwarded-proto'] ?? 'http';
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;
  const { id } = req.query;

  const order = await DbRepo.Order.GetSingle(id!.toString(), true);
  if (!order) return res.status(404).send('Unable to retrieve order');

  if (order.documents)
    await Promise.all(
      order.documents
        .filter((x) => x.googleId)
        .map((x) =>
          GapiWrapper.Instance.drive.files.delete({ fileId: x.googleId! })
        )
    );

  await DbRepo.Order.Delete(id!.toString());

  Revalidate.Post(
    {
      secret: environment.SECRET,
      paths: defaultRevalidatePaths,
    },
    baseUrl
  );
  return res.status(200).send('Deletion of order successful');
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toUpperCase()) {
    case 'GET':
      await getOrder(req, res);
      break;
    case 'PUT':
      await withMiddleware(withBody(), updateOrder)(req, res);
      break;
    case 'DELETE':
      await deleteOrder(req, res);
      break;
  }
};

export default withMiddleware(
  withMethodGuard(['GET', 'PUT', 'DELETE']),
  withQueryParameters([{ name: 'id', isNumber: false }]),
  withAuth,
  handler
);

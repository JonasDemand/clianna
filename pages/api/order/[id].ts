import { IUpsertRequest } from '@customTypes/messages/order';
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

const getOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const order = await DbRepo.Instance.Order.GetSingle(id!.toString(), true);
  if (!order) return res.status(404).send('Unable to retrieve order');

  res.status(200).send(order);
};

const updateOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const body = req.body as IUpsertRequest;

  const customer = await DbRepo.Instance.Order.Update(
    id!.toString(),
    body,
    true
  );
  if (!customer) return res.status(500).send('Unable to update customer');
  res.status(200).send(body);
};

const deleteOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const gapi = new GapiWrapper();

  const order = await DbRepo.Instance.Order.GetSingle(id!.toString(), true);
  if (!order) return res.status(404).send('Unable to retrieve order');

  if (order.documents)
    await Promise.all(
      order.documents
        .filter((x) => x.googleId)
        .map((x) => gapi.drive.files.delete({ fileId: x.googleId! }))
    );

  await DbRepo.Instance.Order.Delete(id!.toString());
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

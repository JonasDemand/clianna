import { IUpsertRequest } from '@customTypes/messages/customer';
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

const getCustomer = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const customer = await DbRepo.Instance.Customer.GetSingle(
    id!.toString(),
    true
  );
  if (!customer) return res.status(404).send('Unable to retrieve customer');

  res.status(200).send(customer);
};

const updateCustomer = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const body = req.body as IUpsertRequest;

  const customer = await DbRepo.Instance.Customer.Update(
    id!.toString(),
    body,
    true
  );
  if (!customer) return res.status(500).send('Unable to update customer');

  res.status(200).send(customer);
};

const deleteCustomer = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  const session = await getSession({ req });
  const gapi = new GapiWrapper(session!.user.refreshToken!);

  const customer = await DbRepo.Instance.Customer.GetSingle(
    id!.toString(),
    true
  );
  if (!customer) return res.status(404).send('Unable to retrieve customer');

  const deleteFilesProm: Array<Promise<any>> = [];
  if (customer.documents)
    deleteFilesProm.concat(
      customer.documents
        .filter((x) => x.googleId)
        .map((x) => gapi.drive.files.delete({ fileId: x.googleId! }))
    );
  if (customer.orders) {
    deleteFilesProm.concat(
      customer.orders
        .filter((order) => order.documents)
        .map((order) =>
          order
            .documents!.filter((document) => document.googleId)
            .map((document) =>
              gapi.drive.files.delete({ fileId: document.googleId! })
            )
        )
        .flat()
    );
  }
  await Promise.all(deleteFilesProm);

  await DbRepo.Instance.Customer.Delete(id!.toString());
  return res.status(200).send('Deletion of customer successful');
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method?.toUpperCase()) {
    case 'GET':
      await getCustomer(req, res);
      break;
    case 'PUT':
      await withMiddleware(withBody(), updateCustomer)(req, res);
      break;
    case 'DELETE':
      await deleteCustomer(req, res);
      break;
  }
};

export default withMiddleware(
  withMethodGuard(['GET', 'PUT', 'DELETE']),
  withQueryParameters([{ name: 'id', isNumber: false }]),
  withAuth,
  handler
);

import DocumentsPage from '@components/Pages/Documents/DocumentsPage';
import DocumentProvider from '@context/DocumentContext';
import { withColumnFilters, withColumnSorting } from '@utils/api/filterParams';
import { Customer, Document, Order } from '@utils/api/generated/Api';
import useApiClientServer from 'hooks/useApiClientServer';
import React from 'react';

const Documents = async () => {
  const ApiClient = await useApiClientServer();

  const responses = await Promise.all([
    ApiClient.document.documentList({
      ColumnSorting: withColumnSorting([{ name: 'CreationDate', desc: true }]),
      PageSize: 100,
      PageNumber: 1,
    }),
    ApiClient.customer.customerList({
      ColumnFilters: withColumnFilters([{ name: 'Disabled', value: 'false' }]),
      ColumnSorting: withColumnSorting([{ name: 'LastName' }]),
      PageSize: 500, //TODO: add pagination
    }),
    ApiClient.order.orderList({
      ColumnSorting: withColumnSorting([{ name: 'CreationDate', desc: true }]),
      PageSize: 500, //TODO: add pagination
    }),
  ]);

  if (responses.some((res) => res.error || !res.data))
    throw new Error('Failed to fetch');

  const [documents, customers, orders] = responses.map((res) => res.data);

  return (
    <DocumentProvider
      initialCustomers={customers as Customer[]}
      initialOrders={orders as Order[]}
      initialDocuments={documents as Document[]}
    >
      <DocumentsPage />
    </DocumentProvider>
  );
};

export default Documents;

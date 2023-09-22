import DocumentsPage from '@components/Pages/Documents/DocumentsPage';
import DocumentProvider from '@context/DocumentContext';
import { Customer, Document, Order } from '@utils/api/generated/Api';
import useApiClientServer from 'hooks/useApiClientServer';
import React from 'react';

const Documents = async () => {
  const ApiClient = await useApiClientServer();

  const responses = await Promise.all([
    ApiClient.customer.customerList(),
    ApiClient.order.orderList(),
    ApiClient.document.documentList(),
  ]);

  if (responses.some((res) => res.error || !res.data))
    throw new Error('Failed to fetch');

  const [customers, orders, documents] = responses.map((res) => res.data);

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

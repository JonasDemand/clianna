import DocumentsPage from '@components/Pages/Documents/DocumentsPage';
import DocumentProvider from '@context/DocumentContext';
import PaginationProvider from '@context/PaginationContext';
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
      PageSize: 1000, //TODO: add pagination
    }),
    ApiClient.order.orderList({
      ColumnSorting: withColumnSorting([{ name: 'CreationDate', desc: true }]),
      PageSize: 1000, //TODO: add pagination
    }),
  ]);

  if (
    responses.some((res) => res.error || !res.data?.list || !res.data.metaData)
  )
    throw new Error('Failed to fetch');

  const [documents, customers, orders] = responses.map((res) => res.data);

  return (
    <PaginationProvider
      initialRowsCount={documents!.metaData!.totalCount}
      initalSortModel={[{ field: 'creationDate', sort: 'desc' }]}
    >
      <DocumentProvider
        initialCustomers={customers!.list as Customer[]}
        initialOrders={orders!.list as Order[]}
        initialDocuments={documents!.list as Document[]}
      >
        <DocumentsPage />
      </DocumentProvider>
    </PaginationProvider>
  );
};

export default Documents;

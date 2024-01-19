import CustomersPage from '@components/Pages/Customers/CustomersPage';
import CustomerProvider from '@context/CustomerContext';
import PaginationProvider from '@context/PaginationContext';
import { withColumnFilters, withColumnSorting } from '@utils/api/filterParams';
import { Customer, Document } from '@utils/api/generated/Api';
import useApiClientServer from 'hooks/useApiClientServer';
import React from 'react';

const Customers = async () => {
  const ApiClient = await useApiClientServer();

  const responses = await Promise.all([
    ApiClient.customer.customerList({
      ColumnFilters: withColumnFilters([{ name: 'Disabled', value: 'false' }]),
      ColumnSorting: withColumnSorting([{ name: 'LastName' }]),
      PageSize: 100,
    }),
    ApiClient.document.documentList({
      ColumnFilters: withColumnFilters([{ name: 'Template', value: 'true' }]),
      ColumnSorting: withColumnSorting([{ name: 'CreationDate', desc: true }]),
      PageSize: 1000, //TODO: add pagination
    }),
  ]);

  if (
    responses.some((res) => res.error || !res.data?.list || !res.data.metaData)
  )
    throw new Error('Failed to fetch');

  const [customers, templates] = responses.map((res) => res.data!);

  return (
    <PaginationProvider
      initialRowsCount={customers.metaData!.totalCount!}
      initalSortModel={[{ field: 'lastName', sort: 'asc' }]}
    >
      <CustomerProvider
        initialCustomers={customers.list as Customer[]}
        initialTemplates={templates.list as Document[]}
      >
        <CustomersPage />
      </CustomerProvider>
    </PaginationProvider>
  );
};

export default Customers;

import CustomersPage from '@components/Pages/Customers/CustomersPage';
import CustomerProvider from '@context/CustomerContext';
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
      PageSize: 500, //TODO: add pagination
    }),
  ]);

  if (responses.some((res) => res.error || !res.data))
    throw new Error('Failed to fetch');

  const [customers, templates] = responses.map((res) => res.data);

  return (
    <CustomerProvider
      initialCustomers={customers as Customer[]}
      initialTemplates={templates as Document[]}
    >
      <CustomersPage />
    </CustomerProvider>
  );
};

export default Customers;

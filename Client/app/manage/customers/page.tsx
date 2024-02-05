import CustomersPage from '@components/Pages/Customers/CustomersPage';
import CustomerProvider from '@context/CustomerContext';
import PaginationProvider from '@context/PaginationContext';
import { withColumnFilters, withColumnSorting } from '@utils/api/filterParams';
import useApiClientServer from 'hooks/useApiClientServer';
import React from 'react';

const Customers = async () => {
  const ApiClient = await useApiClientServer();

  const { data, error } = await ApiClient.customer.customerList({
    ColumnFilters: withColumnFilters([{ name: 'Disabled', value: 'false' }]),
    ColumnSorting: withColumnSorting([{ name: 'LastName' }]),
    PageSize: 100,
  });

  if (error || !data?.list || !data.metaData)
    throw new Error('Failed to fetch');

  return (
    <PaginationProvider
      initialRowsCount={data.metaData.totalCount}
      initalSortModel={[{ field: 'lastName', sort: 'asc' }]}
    >
      <CustomerProvider initialCustomers={data.list}>
        <CustomersPage />
      </CustomerProvider>
    </PaginationProvider>
  );
};

export default Customers;

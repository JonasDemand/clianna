import CustomersPage from '@components/Pages/Customers/CustomersPage';
import CustomerProvider from '@context/CustomerContext';
import CustomSessionProvider from '@context/CustomSessionContext';
import PaginationProvider from '@context/PaginationContext';
import { withColumnFilters, withColumnSorting } from '@utils/api/filterParams';
import useApiClientServer from 'hooks/useApiClientServer';
import React from 'react';

import { auth } from '../../../config/auth';

const Customers = async () => {
  const session = await auth();
  if (!session) throw new Error('Session is null');
  const ApiClient = await useApiClientServer(null, session);

  const { data, error } = await ApiClient.customer.customerList({
    ColumnFilters: withColumnFilters([{ name: 'Disabled', value: 'false' }]),
    ColumnSorting: withColumnSorting([{ name: 'LastName' }]),
    PageSize: 100,
  });

  if (error || !data?.list || !data.metaData)
    throw new Error('Failed to fetch');

  return (
    <CustomSessionProvider session={session}>
      <PaginationProvider
        initialRowsCount={data.metaData.totalCount}
        initalSortModel={[{ field: 'lastName', sort: 'asc' }]}
      >
        <CustomerProvider initialCustomers={data.list}>
          <CustomersPage />
        </CustomerProvider>
      </PaginationProvider>
    </CustomSessionProvider>
  );
};

export default Customers;

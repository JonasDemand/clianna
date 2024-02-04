import CustomersPage from '@components/Pages/Customers/CustomersPage';
import CustomerProvider from '@context/CustomerContext';
import CustomSessionProvider from '@context/CustomSessionContext';
import PaginationProvider from '@context/PaginationContext';
import { withColumnFilters, withColumnSorting } from '@utils/api/filterParams';
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import useApiClientServer from 'hooks/useApiClientServer';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import React from 'react';

const Customers = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  console.log(session);
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

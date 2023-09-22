import CustomersPage from '@components/Pages/Customers/CustomersPage';
import CustomerProvider from '@context/CustomerContext';
import { Customer, Document } from '@utils/api/generated/Api';
import useApiClientServer from 'hooks/useApiClientServer';
import React from 'react';

const Customers = async () => {
  const ApiClient = await useApiClientServer();

  const responses = await Promise.all([
    ApiClient.customer.customerList(),
    ApiClient.document.documentList(),
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

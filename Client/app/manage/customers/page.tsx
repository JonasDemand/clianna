import CustomersPage from '@components/Pages/Customers/CustomersPage';
import CustomerProvider from '@context/CustomerContext';
import { getApiClient } from '@utils/api/ApiClient';
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import React from 'react';

const ApiClient = getApiClient();

const Customers = async () => {
  const session = await getServerSession(authOptions);

  ApiClient.setSecurityData({ token: session?.user.token });

  const { data: customers } = await ApiClient.customer.customerList();
  const { data: templates } = await ApiClient.document.documentList();
  return (
    <CustomerProvider
      initialCustomers={customers ?? []}
      initialTemplates={templates ?? []}
    >
      <CustomersPage />
    </CustomerProvider>
  );
};

export default Customers;

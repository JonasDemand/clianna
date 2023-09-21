import CustomersPage from '@components/Pages/Customers/CustomersPage';
import CustomerProvider from '@context/CustomerContext';
import { SecurityDataType } from '@customTypes/api';
import { Client } from '@utils/api/generated/Api';
import { environment } from '@utils/config';
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import React from 'react';

const ApiClient = new Client<SecurityDataType>({
  baseUrl: environment.NEXT_PUBLIC_CLIANNA_API_URL,
  securityWorker: (securityData) => {
    if (securityData?.token)
      return {
        headers: { Authorization: `Bearer ${securityData.token}` },
      };
  },
});

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

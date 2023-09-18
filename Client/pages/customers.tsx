import CustomersPage from '@components/Pages/Customers/CustomersPage';
import AuthenticationWrapper from '@components/Wrappers/AuthenticationWrapper';
import LayoutWrapper from '@components/Wrappers/LayoutWrapper';
import CustomerProvider from '@context/CustomerContext';
import { NextPage } from 'next';
import React from 'react';

const Customers: NextPage = () => {
  return (
    <AuthenticationWrapper>
      <LayoutWrapper>
        <CustomerProvider initialCustomers={[]} initialTemplates={[]}>
          <CustomersPage />
        </CustomerProvider>
      </LayoutWrapper>
    </AuthenticationWrapper>
  );
};

export default Customers;

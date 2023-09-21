import CustomersPage from '@components/Pages/Customers/CustomersPage';
import CustomerProvider from '@context/CustomerContext';
import { NextPage } from 'next';
import React from 'react';

const Customers: NextPage = () => {
  return (
    <CustomerProvider initialCustomers={[]} initialTemplates={[]}>
      <CustomersPage />
    </CustomerProvider>
  );
};

export default Customers;

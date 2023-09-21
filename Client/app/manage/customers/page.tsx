import CustomersPage from '@components/Pages/Customers/CustomersPage';
import CustomerProvider from '@context/CustomerContext';
import React from 'react';

const Customers = async () => {
  /*const { Client } = useApiContext();

  const { data: customers } = await Client.customer.customerList();
  const { data: templates } = await Client.document.documentList(); //TODO*/
  return (
    <CustomerProvider initialCustomers={[]} initialTemplates={[]}>
      <CustomersPage />
    </CustomerProvider>
  );
};

export default Customers;

import CustomersPage from '@components/Pages/Customers/CustomersPage';
import AuthenticationWrapper from '@components/Wrappers/AuthenticationWrapper';
import LayoutWrapper from '@components/Wrappers/LayoutWrapper';
import CustomerProvider from '@context/CustomerContext';
import { ICustomerWithDependencies } from '@customTypes/database/customer';
import { IDocument } from '@customTypes/database/document';
import { DbRepo } from '@utils/DbRepo';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';

type CustomersProps = {
  customers: ICustomerWithDependencies[];
  templates: IDocument[];
};

const Customers: NextPage<CustomersProps> = ({ customers, templates }) => {
  return (
    <AuthenticationWrapper>
      <LayoutWrapper>
        <CustomerProvider
          initialCustomers={customers}
          initialTemplates={templates}
        >
          <CustomersPage />
        </CustomerProvider>
      </LayoutWrapper>
    </AuthenticationWrapper>
  );
};

export const getServerSideProps: GetServerSideProps<
  CustomersProps
> = async () => {
  return {
    props: {
      customers: await DbRepo.Customer.GetAll(true),
      templates: await DbRepo.Document.GetTemplates(false),
    },
  };
};

export default Customers;

import CustomersPage from '@components/Pages/Customers/CustomersPage';
import AuthenticationWrapper from '@components/Wrappers/AuthenticationWrapper';
import LayoutWrapper from '@components/Wrappers/LayoutWrapper';
import CustomerProvider from '@context/CustomerContext';
import { ICustomerWithDependencies } from '@customTypes/database/customer';
import { IDocument } from '@customTypes/database/document';
import { DbRepo } from '@utils/DbRepo';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
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

export const getServerSideProps: GetServerSideProps<CustomersProps> = async (
  context
) => {
  const session = await getSession(context);
  if (!session) return { props: { customers: [], templates: [] } };
  DbRepo.Init(session.user.id ?? '');
  return {
    props: {
      customers: await DbRepo.Instance.Customer.GetAll(true),
      templates: await DbRepo.Instance.Document.GetTemplates(false),
    },
  };
};

export default Customers;

import DocumentsPage from '@components/Pages/Documents/DocumentsPage';
import AuthenticationWrapper from '@components/Wrappers/AuthenticationWrapper';
import LayoutWrapper from '@components/Wrappers/LayoutWrapper';
import DocumentProvider from '@context/DocumentContext';
import { NextPage } from 'next';
import React from 'react';

const Documents: NextPage = () => {
  return (
    <AuthenticationWrapper>
      <LayoutWrapper>
        <DocumentProvider
          initialCustomers={[]}
          initialOrders={[]}
          initialDocuments={[]}
        >
          <DocumentsPage />
        </DocumentProvider>
      </LayoutWrapper>
    </AuthenticationWrapper>
  );
};

export default Documents;

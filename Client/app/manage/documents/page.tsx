import DocumentsPage from '@components/Pages/Documents/DocumentsPage';
import DocumentProvider from '@context/DocumentContext';
import { NextPage } from 'next';
import React from 'react';

const Documents: NextPage = () => {
  return (
    <DocumentProvider
      initialCustomers={[]}
      initialOrders={[]}
      initialDocuments={[]}
    >
      <DocumentsPage />
    </DocumentProvider>
  );
};

export default Documents;

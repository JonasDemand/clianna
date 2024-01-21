import DocumentsPage from '@components/Pages/Documents/DocumentsPage';
import DocumentProvider from '@context/DocumentContext';
import PaginationProvider from '@context/PaginationContext';
import { withColumnSorting } from '@utils/api/filterParams';
import useApiClientServer from 'hooks/useApiClientServer';
import React from 'react';

const Documents = async () => {
  const ApiClient = await useApiClientServer();

  const { data, error } = await ApiClient.document.documentList({
    ColumnSorting: withColumnSorting([{ name: 'CreationDate', desc: true }]),
    PageSize: 100,
    PageNumber: 1,
  });

  if (error || !data?.list || !data.metaData)
    throw new Error('Failed to fetch');

  return (
    <PaginationProvider
      initialRowsCount={data.metaData.totalCount}
      initalSortModel={[{ field: 'creationDate', sort: 'desc' }]}
    >
      <DocumentProvider initialDocuments={data.list}>
        <DocumentsPage />
      </DocumentProvider>
    </PaginationProvider>
  );
};

export default Documents;

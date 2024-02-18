import MessagesPage from '@components/Pages/Messages/MessagesPage';
import MessageProvider from '@context/MessageContext';
import PaginationProvider from '@context/PaginationContext';
import { withColumnSorting } from '@utils/api/filterParams';
import useApiClientServer from 'hooks/useApiClientServer';
import React from 'react';

const Messages = async () => {
  const ApiClient = await useApiClientServer();

  const { data, error } = await ApiClient.message.messageList({
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
      <MessageProvider initialMessages={data.list}>
        <MessagesPage />
      </MessageProvider>
    </PaginationProvider>
  );
};

export default Messages;

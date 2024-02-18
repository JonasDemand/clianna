'use client';

import MuiTable from '@components/External/MuiTable';
import ConfirmDialog from '@components/Modals/ConfirmDialog';
import SideOverlay from '@components/Modals/SideOverlay';
import { useMessageContext } from '@context/MessageContext';
import { EId } from '@customTypes/id';
import { Box, Typography } from '@mui/material';
import { Message } from '@utils/api/generated/Api';
import { getMessageLabel, toMessageUpsertRequest } from '@utils/message';
import useApiClient from 'hooks/useApiClient';
import { isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { FC, useCallback, useState } from 'react';

import MessageForm from './Form';
import MessagesTableHeader from './MessagesTableHeader';

const MessagesPage: FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { activeColumns, selected, setSelected, messages, setMessages } =
    useMessageContext();
  const ApiClient = useApiClient();

  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);

  const onCloseOverlay = useCallback(() => setSelected(null), [setSelected]);
  const onCloseDialog = useCallback(() => setMessageToDelete(null), []);

  const onSaveOverlay = useCallback(async () => {
    if (!selected || !selected.id) return;
    if (
      isEqual(
        selected,
        messages.find((x) => x.id === selected.id)
      )
    ) {
      enqueueSnackbar('Keine Daten zum Speichern vorhanden', {
        variant: 'info',
      });
      return;
    }

    const res =
      selected.id === EId.Create
        ? await ApiClient.message.messageCreate(
            toMessageUpsertRequest(selected)
          )
        : await ApiClient.message.messageUpdate(
            selected.id,
            toMessageUpsertRequest(selected)
          );

    const { error, data } = res;
    if (error || !data) {
      enqueueSnackbar('Erstellen von Nachricht fehlgeschlagen', {
        variant: 'error',
      });
      return;
    }

    let newMessages = [...messages];
    const index = newMessages.findIndex((x) => x.id === data.id);
    index === -1 ? newMessages.unshift(data) : (newMessages[index] = data);
    setMessages(newMessages);
    setSelected(null);

    enqueueSnackbar('Erfolgreich Nachricht aktualisiert', {
      variant: 'success',
    });
  }, [
    ApiClient,
    enqueueSnackbar,
    messages,
    selected,
    setMessages,
    setSelected,
  ]);

  const onCopyRow = useCallback(
    async (message: Message) =>
      setSelected({
        ...message,
        id: EId.Create,
        name: `${message.name} - Kopie`,
      }),
    [setSelected]
  );

  const onConfirmDialog = useCallback(async () => {
    if (!messageToDelete || !messageToDelete.id) return;
    const { error } = await ApiClient.message.messageDelete(messageToDelete.id);
    if (error) {
      enqueueSnackbar('Löschen von Nachricht fehlgeschlagen', {
        variant: 'error',
      });
      return;
    }
    enqueueSnackbar('Erfolgreich Nachricht gelöscht', { variant: 'success' });
    setMessageToDelete(null);
    setMessages(
      messages.filter((message) => message.id !== messageToDelete.id)
    );
  }, [ApiClient, enqueueSnackbar, messageToDelete, messages, setMessages]);

  const onRowClick = useCallback(
    ({ row }: { row: Message }) => setSelected(row),
    [setSelected]
  );

  return (
    <Box
      sx={{
        height: 1,
      }}
    >
      <MuiTable<Message>
        header={<MessagesTableHeader />}
        rows={messages}
        columns={activeColumns}
        onRowClick={onRowClick}
        onCopy={onCopyRow}
        onDelete={setMessageToDelete}
      />
      <SideOverlay
        heading="Nachricht bearbeiten"
        open={!!selected}
        onClose={onCloseOverlay}
        onSave={onSaveOverlay}
      >
        <MessageForm />
      </SideOverlay>
      <ConfirmDialog
        open={!!messageToDelete}
        title="Nachricht löschen"
        onClose={onCloseDialog}
        onConfirm={onConfirmDialog}
      >
        <Typography mb={2}>
          Bist du dir sicher, dass Du diese Nachricht löschen willst?
        </Typography>
        <Typography fontWeight="bold">
          {getMessageLabel(messageToDelete)}
        </Typography>
      </ConfirmDialog>
    </Box>
  );
};

export default MessagesPage;

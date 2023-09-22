'use client';

import MuiTable from '@components/External/MuiTable';
import ConfirmDialog from '@components/Modals/ConfirmDialog';
import SideOverlay from '@components/Modals/SideOverlay';
import { useDocumentContext } from '@context/DocumentContext';
import { EId } from '@customTypes/id';
import { Box, Typography } from '@mui/material';
import { Document } from '@utils/api/generated/Api';
import { getDocumentLabel } from '@utils/document';
import { useApiContext } from 'hooks/useApiClient';
import { isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { FC, useCallback, useState } from 'react';

import DocumentsTableHeader from './DocumentsTableHeader';
import DocumentForm from './Form';

const DocumentsPage: FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const {
    activeColumns,
    selected,
    setSelected,
    searchText,
    documents,
    filteredDocuments,
    setDocuments,
  } = useDocumentContext();
  const { Client } = useApiContext();

  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null
  );

  const onCloseOverlay = useCallback(() => setSelected(null), [setSelected]);
  const onCloseDialog = useCallback(() => setDocumentToDelete(null), []);

  const onSaveOverlay = useCallback(async () => {
    if (!selected || !selected.id) return;
    if (
      isEqual(
        selected,
        documents.find((x) => x.id === selected.id)
      )
    ) {
      enqueueSnackbar('Keine Daten zum Speichern vorhanden', {
        variant: 'info',
      });
      return;
    }

    /*TODO
    const res = selected.id.includes(EId.Copy)
      ? await Client.Document.Copy(getCopyId(selected.id), selected)
      : selected.id === EId.Create
      ? await Client.Document.Create(selected)
      : await Client.Document.Update(selected.id, selected);

    const { error, response } = res;
    if (error || !response) {
      enqueueSnackbar('Erstellen von Dokument fehlgeschlagen', {
        variant: 'error',
      });
      return;
    }

    let newDocuments = [...documents];
    const index = newDocuments.findIndex((x) => x.id === response.id);
    index === -1
      ? newDocuments.push(response)
      : (newDocuments[index] = response);
    setDocuments(newDocuments);
    setSelected(null);*/

    enqueueSnackbar('Erfolgreich Dokument aktualisiert', {
      variant: 'success',
    });
  }, [documents, enqueueSnackbar, selected]);

  const onCopyRow = useCallback(
    async (document: Document) =>
      setSelected({
        ...document,
        id: `${EId.Copy}_${document.id}`,
        name: `${document.name} - Kopie`,
      }),
    [setSelected]
  );

  const onConfirmDialog = useCallback(async () => {
    if (!documentToDelete || !documentToDelete.id) return;
    const { error } = await Client.document.documentDelete(documentToDelete.id);
    if (error) {
      enqueueSnackbar('Löschen von Dokument fehlgeschlagen', {
        variant: 'error',
      });
      return;
    }
    enqueueSnackbar('Erfolgreich Dokument gelöscht', { variant: 'success' });
    setDocumentToDelete(null);
    setDocuments(
      documents.filter((document) => document.id !== documentToDelete.id)
    );
  }, [
    Client.document,
    documentToDelete,
    documents,
    enqueueSnackbar,
    setDocuments,
  ]);

  const onRowClick = useCallback(
    ({ row }: { row: Document }) => setSelected(row),
    [setSelected]
  );

  return (
    <Box
      sx={{
        height: 1,
      }}
    >
      <MuiTable<Document>
        header={<DocumentsTableHeader />}
        rows={filteredDocuments}
        columns={activeColumns}
        onRowClick={onRowClick}
        onCopy={onCopyRow}
        onDelete={setDocumentToDelete}
        searchText={searchText}
      />
      <SideOverlay
        heading="Dokument bearbeiten"
        open={!!selected}
        onClose={onCloseOverlay}
        onSave={onSaveOverlay}
      >
        <DocumentForm />
      </SideOverlay>
      <ConfirmDialog
        open={!!documentToDelete}
        title="Dokument löschen"
        onClose={onCloseDialog}
        onConfirm={onConfirmDialog}
      >
        <Typography mb={2}>
          Bist du dir sicher, dass Du dieses Dokument löschen willst?
        </Typography>
        <Typography fontWeight="bold">
          {getDocumentLabel(documentToDelete)}
        </Typography>
      </ConfirmDialog>
    </Box>
  );
};

export default DocumentsPage;

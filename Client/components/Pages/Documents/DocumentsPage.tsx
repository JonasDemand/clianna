'use client';

import MuiTable from '@components/External/MuiTable';
import ConfirmDialog from '@components/Modals/ConfirmDialog';
import SideOverlay from '@components/Modals/SideOverlay';
import { useDocumentContext } from '@context/DocumentContext';
import { EId } from '@customTypes/id';
import { Box, Typography } from '@mui/material';
import { Document } from '@utils/api/generated/Api';
import { getDocumentLabel, toDocumentUpsertRequest } from '@utils/document';
import { getCopyId } from '@utils/id';
import useApiClient from 'hooks/useApiClient';
import { isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { FC, useCallback, useState } from 'react';

import DocumentsTableHeader from './DocumentsTableHeader';
import DocumentForm from './Form';

const DocumentsPage: FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { activeColumns, selected, setSelected, documents, setDocuments } =
    useDocumentContext();
  const ApiClient = useApiClient();

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

    const res = selected.id.includes(EId.Copy)
      ? await ApiClient.document.copyCreate(
          getCopyId(selected.id),
          toDocumentUpsertRequest(selected)
        )
      : selected.id === EId.Create
      ? await ApiClient.document.documentCreate(
          toDocumentUpsertRequest(selected)
        )
      : await ApiClient.document.documentUpdate(
          selected.id,
          toDocumentUpsertRequest(selected)
        );

    const { error, data } = res;
    if (error || !data) {
      enqueueSnackbar('Erstellen von Dokument fehlgeschlagen', {
        variant: 'error',
      });
      return;
    }

    let newDocuments = [...documents];
    const index = newDocuments.findIndex((x) => x.id === data.id);
    index === -1 ? newDocuments.push(data) : (newDocuments[index] = data);
    setDocuments(newDocuments);
    setSelected(null);

    enqueueSnackbar('Erfolgreich Dokument aktualisiert', {
      variant: 'success',
    });
  }, [
    ApiClient.document,
    documents,
    enqueueSnackbar,
    selected,
    setDocuments,
    setSelected,
  ]);

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
    const { error } = await ApiClient.document.documentDelete(
      documentToDelete.id
    );
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
    ApiClient.document,
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
        rows={documents}
        columns={activeColumns}
        onRowClick={onRowClick}
        onCopy={onCopyRow}
        onDelete={setDocumentToDelete}
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

import ConfirmDialog from '@components/Dialog/ConfirmDialog';
import MuiTable from '@components/External/MuiTable';
import SideOverlay from '@components/SideOverlay/SideOverlay';
import { DocumentContext } from '@context/DocumentContext';
import { IDocumentWithDependencies } from '@customTypes/database/document';
import { DocumentContextType } from '@customTypes/document';
import { EId } from '@customTypes/id';
import { Box, Typography } from '@mui/material';
import { ApiClient } from '@utils/api/client';
import { getCustomerLabel } from '@utils/customer';
import { getCopyId } from '@utils/id';
import { isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import { FC, useCallback, useContext, useState } from 'react';

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
  } = useContext(DocumentContext) as DocumentContextType;

  const [documentToDelete, setDocumentToDelete] =
    useState<IDocumentWithDependencies | null>(null);

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
      ? await ApiClient.Document.Copy(getCopyId(selected.id), selected)
      : selected.id === EId.Create
      ? await ApiClient.Document.Create(selected)
      : await ApiClient.Document.Update(selected.id, selected);

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
    setSelected(null);

    enqueueSnackbar('Erfolgreich Dokument aktualisiert', {
      variant: 'success',
    });
  }, [documents, enqueueSnackbar, selected, setDocuments, setSelected]);

  const onCopyRow = useCallback(
    async (document: IDocumentWithDependencies) =>
      setSelected({
        ...document,
        id: `${EId.Copy}_${document.id}`,
        name: `${document.name} - Kopie`,
      }),
    [setSelected]
  );

  const onConfirmDialog = useCallback(async () => {
    if (!documentToDelete || !documentToDelete.id) return;
    const { error } = await ApiClient.Document.Delete(documentToDelete.id);
    if (error) {
      enqueueSnackbar('Löschen von Dokument fehlgeschlagen', {
        variant: 'error',
      });
      return;
    }
    enqueueSnackbar('Erfolgreich Dokument gelöscht', { variant: 'success' });
    setDocuments(
      documents.filter((document) => document.id !== documentToDelete.id)
    );
  }, [documentToDelete, documents, enqueueSnackbar, setDocuments]);

  return (
    <Box
      sx={{
        height: 1,
      }}
    >
      <MuiTable<IDocumentWithDependencies>
        header={<DocumentsTableHeader />}
        rows={filteredDocuments}
        columns={activeColumns}
        onEdit={setSelected}
        onCopy={onCopyRow}
        onDelete={setDocumentToDelete}
        searchText={searchText}
      />
      <SideOverlay
        heading="Auftrag bearbeiten"
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
          Dokument {documentToDelete?.id}
          {(documentToDelete?.customer || documentToDelete?.order) && (
            <>
              <br />
              {documentToDelete.customer
                ? `Für Kunde ${getCustomerLabel(documentToDelete.customer)}`
                : `Für Auftrag ${documentToDelete.order?.id}`}
            </>
          )}
        </Typography>
      </ConfirmDialog>
    </Box>
  );
};

export default DocumentsPage;

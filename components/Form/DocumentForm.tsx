import ConfirmDialog from '@components/Dialog/ConfirmDialog';
import MuiButton from '@components/External/MuiButton';
import MuiTable from '@components/External/MuiTable';
import MuiTextField from '@components/External/MuiTextField';
import { columns } from '@consts/document';
import {
  IDocument,
  IDocumentWithDependencies,
} from '@customTypes/database/document';
import { Add, Search } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';
import { ApiClient } from '@utils/api/client';
import { getDocumentLabel } from '@utils/document';
import { searchArray } from '@utils/search';
import { useSnackbar } from 'notistack';
import React, { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';

import FormSection from './FormSection';

type DocumentFormProps = {
  documents: IDocument[];
  onUpdate: (documents: IDocument[]) => void;
  reference: Pick<IDocumentWithDependencies, 'customer' | 'order'>;
};

const DocumentForm: FC<DocumentFormProps> = ({
  documents,
  onUpdate,
  reference,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [documentToDelete, setDocumentToDelete] = useState<IDocument | null>(
    null
  );
  const [selected, setSelected] = useState<IDocument | null>(null);
  const [searchText, setSearchText] = useState('');

  const filteredDocuments = useMemo(
    () => searchArray(documents, searchText),
    [documents, searchText]
  );

  const onCloseDeleteDialog = useCallback(() => setDocumentToDelete(null), []);
  const onCloseSelectedDialog = useCallback(() => setSelected(null), []);

  const onConfirmDeleteDialog = useCallback(async () => {
    console.log(documentToDelete);
  }, [documentToDelete]);
  const onConfirmSelectedDialog = useCallback(async () => {
    if (!selected) return;
    const res = selected.id
      ? await ApiClient.Document.Update(selected.id, selected)
      : await ApiClient.Document.Create({ ...selected, ...reference });

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
    onUpdate(newDocuments);

    enqueueSnackbar(
      `Erfolgreich Dokument ${!selected.id ? 'erstellt' : 'aktualisiert'}`,
      {
        variant: 'success',
      }
    );
  }, [documents, enqueueSnackbar, onUpdate, reference, selected]);

  const onCopyDocument = useCallback(
    (document: IDocument) =>
      setSelected({
        ...document,
        id: undefined,
        name: `${document.name} - Kopie`,
      }),
    []
  );

  const onClickAdd = useCallback(() => setSelected({}), []);

  const onChangeSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value),
    []
  );

  return (
    <>
      <FormSection label="Dokumente">
        <Box sx={{ height: '500px' }}>
          <MuiTable
            header={
              <Grid
                container
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <Grid item xs={12} md={8}>
                  <MuiTextField
                    fullWidth
                    type="text"
                    label="Suche"
                    value={searchText}
                    onChange={onChangeSearch}
                    InputProps={{
                      endAdornment: <Search />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <MuiButton
                    variant="contained"
                    color="success"
                    fullWidth
                    startIcon={<Add />}
                    onClick={onClickAdd}
                  >
                    Hinzufügen
                  </MuiButton>
                </Grid>
              </Grid>
            }
            searchText={searchText}
            columns={columns}
            rows={filteredDocuments}
            onDelete={setDocumentToDelete}
            onEdit={setSelected}
            onCopy={onCopyDocument}
          ></MuiTable>
        </Box>
      </FormSection>

      <ConfirmDialog
        open={!!selected}
        onClose={onCloseSelectedDialog}
        onConfirm={onConfirmSelectedDialog}
        title="Dokument bearbeiten"
        confirmLabel="Speichern"
        abortLabel="Abbrechen"
      >
        <Grid container>
          <Grid item xs={6}>
            <MuiTextField
              required
              label="Name"
              value={selected?.name}
              onChange={(e) =>
                setSelected({
                  ...selected,
                  name: e.target.value,
                })
              }
            />
          </Grid>
        </Grid>
      </ConfirmDialog>
      <ConfirmDialog
        open={!!documentToDelete}
        onClose={onCloseDeleteDialog}
        onConfirm={onConfirmDeleteDialog}
        title="Dokument löschen"
      >
        <Typography mb={2}>
          Bist du dir sicher, dass Du dieses Dokument löschen willst?
        </Typography>
        <Typography fontWeight="bold">
          {getDocumentLabel(documentToDelete)}
        </Typography>
      </ConfirmDialog>
    </>
  );
};

export default DocumentForm;

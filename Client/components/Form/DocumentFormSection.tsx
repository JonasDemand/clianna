import MuiButton from '@components/External/MuiButton';
import MuiTable from '@components/External/MuiTable';
import MuiTextField from '@components/External/MuiTextField';
import ConfirmDialog from '@components/Modals/ConfirmDialog';
import { defaultVariableColumns } from '@consts/document';
import { useApiContext } from '@context/ApiContext';
import { EId } from '@customTypes/id';
import { Add, Search } from '@mui/icons-material';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Grid,
  Typography,
} from '@mui/material';
import { Document } from '@utils/api/generated/Api';
import { getDocumentLabel } from '@utils/document';
import { getCopyId } from '@utils/id';
import { searchArray } from '@utils/search';
import { isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';

import FormSection from './FormSection';

type DocumentFormProps = {
  documents: Document[];
  templates: Document[];
  onUpdate: (documents: Document[]) => void;
  reference: { customer?: string | null; order?: string | null };
};

const DocumentFormSection: FC<DocumentFormProps> = ({
  documents,
  templates,
  onUpdate,
  reference,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { Client } = useApiContext();

  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null
  );
  const [selected, setSelected] = useState<Document | null>(null);
  const [searchText, setSearchText] = useState('');

  const filteredDocuments = useMemo(
    () =>
      searchArray(
        documents.filter((document) => !document.template),
        searchText
      ),
    [documents, searchText]
  );
  const withReference = useCallback(
    (document: Document): Document => ({
      ...document,
      customer: {
        id:
          document.customer?.id ??
          (reference.customer !== EId.Copy && reference.customer !== EId.Create
            ? reference.customer
            : undefined),
      },
      order: {
        id:
          document.order?.id ??
          (reference.order !== EId.Copy && reference.order !== EId.Create
            ? reference.order
            : undefined),
      },
    }),
    [reference.customer, reference.order]
  );

  const onCloseDeleteDialog = useCallback(() => setDocumentToDelete(null), []);
  const onCloseSelectedDialog = useCallback(() => setSelected(null), []);

  const onConfirmDeleteDialog = useCallback(async () => {
    if (!documentToDelete || !documentToDelete.id) return;
    const { error } = await Client.document.documentDelete(
      documentToDelete.id!
    );
    if (error) {
      enqueueSnackbar('Löschen von Dokument fehlgeschlagen', {
        variant: 'error',
      });
      return;
    }
    onUpdate(documents.filter((x) => x.id !== documentToDelete.id));
    setDocumentToDelete(null);

    enqueueSnackbar('Erfolgreich Dokument gelöscht', {
      variant: 'success',
    });
  }, [Client.document, documentToDelete, documents, enqueueSnackbar, onUpdate]);
  const onConfirmSelectedDialog = useCallback(async () => {
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
      ? await Client.documentCOPY(
          getCopyId(selected.id),
          withReference(selected)
        )
      : selected.id === EId.Create
      ? await Client.documentPOST(withReference(selected))
      : await Client.documentPUT(selected.id, selected);

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
    setSelected(null);*/

    enqueueSnackbar('Erfolgreich Dokument aktualisiert', {
      variant: 'success',
    });
  }, [documents, enqueueSnackbar, selected]);

  const onCopyDocument = useCallback(
    (document: Document) =>
      setSelected({
        ...document,
        id: `${EId.Copy}_${document.id}`,
        name: `${document.name} - Kopie`,
      }),
    []
  );

  const onClickAdd = useCallback(() => setSelected({ id: EId.Create }), []);

  const onRowClick = useCallback(
    ({ row }: { row: Document }) => setSelected(row),
    [setSelected]
  );

  const onChangeSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value),
    []
  );
  const onChangeTemplate = useCallback(
    (_: unknown, value: Document | null) =>
      setSelected({
        ...selected,
        id: value ? `${EId.Copy}_${value.id}` : EId.Create,
        name: selected?.name ?? value?.name,
      }),
    [selected]
  );

  const renderInputTemplate = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <MuiTextField {...params} label="Template" />
    ),
    []
  );

  const getOptionLabelTemplate = useCallback(
    (option: Document) => option.name ?? '',
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
            columns={defaultVariableColumns}
            rows={filteredDocuments}
            onRowClick={onRowClick}
            onCopy={onCopyDocument}
            onDelete={setDocumentToDelete}
          />
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
        <Grid container spacing={2}>
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
          {(selected?.id === EId.Create ||
            templates.findIndex(
              (document) => document.id === getCopyId(selected?.id ?? '')
            ) !== -1) && (
            <Grid item xs={6}>
              <Autocomplete
                openOnFocus
                options={templates}
                onChange={onChangeTemplate}
                getOptionLabel={getOptionLabelTemplate}
                renderInput={renderInputTemplate}
              />
            </Grid>
          )}
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

export default DocumentFormSection;

import ConfirmDialog from '@components/Dialog/ConfirmDialog';
import MuiButton from '@components/External/MuiButton';
import MuiTable from '@components/External/MuiTable';
import MuiTextField from '@components/External/MuiTextField';
import { columns } from '@consts/document';
import {
  IDocument,
  IDocumentWithDependencies,
} from '@customTypes/database/document';
import { EId } from '@customTypes/id';
import { Add, Lock, Search } from '@mui/icons-material';
import { Avatar, Box, Grid, Link, Typography } from '@mui/material';
import { ApiClient } from '@utils/api/client';
import { getDocumentLabel } from '@utils/document';
import { getCopyId } from '@utils/id';
import { searchArray } from '@utils/search';
import { isEqual } from 'lodash';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import React, { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';

import FormSection from './FormSection';

type DocumentFormProps = {
  documents: IDocument[];
  onUpdate: (documents: IDocument[]) => void;
  reference: { customer?: string; order?: string };
};

const DocumentForm: FC<DocumentFormProps> = ({
  documents,
  onUpdate,
  reference,
}) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data: session } = useSession();

  const [documentToDelete, setDocumentToDelete] = useState<IDocument | null>(
    null
  );
  const [selected, setSelected] = useState<IDocument | null>(null);
  const [searchText, setSearchText] = useState('');

  const filteredDocuments = useMemo(
    () => searchArray(documents, searchText),
    [documents, searchText]
  );
  const withReference = useCallback(
    (document: IDocument): IDocumentWithDependencies => ({
      ...document,
      customer: {
        id:
          reference.customer !== EId.Copy && reference.customer !== EId.Create
            ? reference.customer
            : undefined,
      },
      order: {
        id:
          reference.order !== EId.Copy && reference.order !== EId.Create
            ? reference.order
            : undefined,
      },
    }),
    [reference.customer, reference.order]
  );

  const onCloseDeleteDialog = useCallback(() => setDocumentToDelete(null), []);
  const onCloseSelectedDialog = useCallback(() => setSelected(null), []);

  const onConfirmDeleteDialog = useCallback(async () => {
    if (!documentToDelete || !documentToDelete.id) return;
    const { error } = await ApiClient.Document.Delete(documentToDelete.id);
    if (error) {
      enqueueSnackbar('Löschen von Dokument fehlgeschlagen', {
        variant: 'error',
      });
      return;
    }
    onUpdate(documents.filter((x) => x.id !== documentToDelete.id));

    enqueueSnackbar('Erfolgreich Dokument gelöscht', {
      variant: 'success',
    });
  }, [documentToDelete, documents, enqueueSnackbar, onUpdate]);
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

    const res = selected.id.includes(EId.Copy)
      ? await ApiClient.Document.Copy(
          getCopyId(selected.id),
          withReference(selected)
        )
      : selected.id === EId.Create
      ? await ApiClient.Document.Create(withReference(selected))
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
    onUpdate(newDocuments);

    enqueueSnackbar(
      `Erfolgreich Dokument ${!selected.id ? 'erstellt' : 'aktualisiert'}`,
      {
        variant: 'success',
      }
    );
  }, [documents, enqueueSnackbar, onUpdate, selected, withReference]);

  const onCopyDocument = useCallback(
    (document: IDocument) =>
      setSelected({
        ...document,
        id: `${EId.Copy}_${document.id}`,
        name: `${document.name} - Kopie`,
      }),
    []
  );

  const onClickAdd = useCallback(() => setSelected({ id: EId.Create }), []);
  const onClickProfile = useCallback(() => router.push('/profile'), [router]);

  const onChangeSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value),
    []
  );

  return (
    <>
      <FormSection label="Dokumente">
        {session?.user.refreshToken && session.user.cliannaFolderId ? (
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
        ) : (
          <Grid container alignItems="center" justifyContent="center">
            <Grid item>
              <Avatar
                sx={{
                  m: 1,
                  bgcolor: 'secondary.main',
                }}
              >
                <Lock />
              </Avatar>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" textAlign="center">
                Muss im{' '}
                <Link onClick={onClickProfile} sx={{ cursor: 'pointer' }}>
                  Profil
                </Link>{' '}
                konfiguriert werden
              </Typography>
            </Grid>
          </Grid>
        )}
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

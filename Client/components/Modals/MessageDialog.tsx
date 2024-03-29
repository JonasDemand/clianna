'use client';

import MuiTextField from '@components/External/MuiTextField';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Grid,
  Typography,
} from '@mui/material';
import { Customer, Message, Order } from '@utils/api/generated/Api';
import { getCustomerLabel, isCustomer } from '@utils/customer';
import { getOrderLabel } from '@utils/order';
import useApiClient from 'hooks/useApiClient';
import { useSnackbar } from 'notistack';
import React, { FC, useCallback, useState } from 'react';

import ConfirmDialog from './ConfirmDialog';

export type MessageDialogProps = {
  templates: Message[];
  reference?: Customer | Order | null;
  onClose: () => void;
};

const MessageDialog: FC<MessageDialogProps> = ({
  reference,
  templates,
  onClose,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const ApiClient = useApiClient();
  const [template, setTemplate] = useState<Message | null>(null);

  const onConfirmDialog = useCallback(async () => {
    const customer = isCustomer(reference);
    const encodedEmail = encodeURIComponent(
      customer
        ? (reference as Customer).email!
        : (reference as Order).customer!.email!
    );

    if (template) {
      const { data, error } = await ApiClient.message.applyTemplateDetail(
        template.id!,
        {
          reference: reference!.id!,
        }
      );
      if (error || !data || !data.subject || !data.body) {
        enqueueSnackbar('Anwenden von Template fehlgeschlagen!', {
          variant: 'error',
        });
        return;
      }

      window.location.href = `mailto:${encodedEmail}?subject=${encodeURIComponent(
        data.subject
      )}&body=${encodeURIComponent(data.body)}`;
    } else window.location.href = `mailto:${encodedEmail}`;
    onClose();
    setTemplate(null);
  }, [ApiClient, enqueueSnackbar, onClose, reference, template]);

  const onChangeTemplate = useCallback(
    (_: unknown, value: Message | null) => setTemplate(value),
    []
  );

  const renderInputTemplate = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <MuiTextField {...params} label="Template" />
    ),
    []
  );

  return (
    <ConfirmDialog
      open={!!reference}
      title="E-Mail schreiben"
      onClose={onClose}
      onConfirm={onConfirmDialog}
      abortLabel="Abbrechen"
      confirmLabel="Mail-Client öffnen"
    >
      <Typography>
        E-Mail für {isCustomer(reference) ? 'Kunde' : 'Auftrag'}
      </Typography>
      <Typography fontWeight="bold" mb={2}>
        {isCustomer(reference)
          ? getCustomerLabel(reference)
          : getOrderLabel(reference)}
      </Typography>
      <Grid container justifyContent="center">
        <Grid item xs={6}>
          <Autocomplete
            openOnFocus
            options={templates}
            onChange={onChangeTemplate}
            getOptionLabel={(option) => option.name ?? ''}
            renderInput={renderInputTemplate}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.name}
              </li>
            )}
          />
        </Grid>
      </Grid>
    </ConfirmDialog>
  );
};

export default MessageDialog;

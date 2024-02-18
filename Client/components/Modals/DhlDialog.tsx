'use client';

import MuiTextField from '@components/External/MuiTextField';
import { Grid, Typography } from '@mui/material';
import { Customer } from '@utils/api/generated/Api';
import { generateDHLPollingClientCSV, getCustomerLabel } from '@utils/customer';
import { formatDate } from '@utils/date';
import React, { FC, useCallback, useState } from 'react';
import { TextEncoder } from 'text-encoding';

import ConfirmDialog from './ConfirmDialog';

export type DhlDialogProps = {
  customer: Customer | null;
  onClose: () => void;
};

const DhlDialog: FC<DhlDialogProps> = ({ customer, onClose }) => {
  const [weight, setWeight] = useState<number>(1);

  const onConfirmDialog = useCallback(() => {
    const dhlFile = generateDHLPollingClientCSV(customer!, weight);
    // Convert the content to Uint8Array with ANSI encoding
    const encoder = new TextEncoder('windows-1252', {
      NONSTANDARD_allowLegacyEncoding: true,
    });

    const encodedData = encoder.encode(dhlFile);

    // Create a Blob with the encoded data
    const blob = new Blob([encodedData], {
      type: 'text/csv;charset=windows-1252',
    });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${customer!.id}-${formatDate(new Date())}.clianna.dhl`
    );

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    onClose();
    setWeight(1);
  }, [customer, weight, onClose]);

  return (
    <ConfirmDialog
      open={!!customer}
      title="DHL-Pollingclient Download"
      onClose={onClose}
      onConfirm={onConfirmDialog}
      abortLabel="Abbrechen"
      confirmLabel="Download"
    >
      <Typography>Paket für Kunde</Typography>
      <Typography fontWeight="bold" mb={2}>
        {getCustomerLabel(customer)}
      </Typography>
      <Grid container justifyContent="center">
        <Grid item xs={6}>
          <MuiTextField
            required
            label="Gewicht"
            type="number"
            inputProps={{
              step: '.5',
            }}
            defaultValue="1.0"
            onChange={(e) => setWeight(parseFloat(e.target.value))}
          />
        </Grid>
      </Grid>
    </ConfirmDialog>
  );
};

export default DhlDialog;

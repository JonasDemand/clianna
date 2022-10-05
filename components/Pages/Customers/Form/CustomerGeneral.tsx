import FormSection from '@components/Form/FormSection';
import { CustomerContext } from '@context/CustomerContext';
import { CustomerContextType } from '@customTypes/customer';
import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import React, { FC, useCallback, useContext } from 'react';

const CustomerGeneral: FC = () => {
  const { selected, updateSelected } = useContext(
    CustomerContext
  ) as CustomerContextType;

  const onChangeDisabled = useCallback(
    (_: unknown, checked: boolean) => updateSelected('disabled', checked),
    [updateSelected]
  );
  const onChangeWhatsapp = useCallback(
    (_: unknown, checked: boolean) => updateSelected('whatsapp', checked),
    [updateSelected]
  );

  return (
    <FormSection label="Allgemein">
      {selected && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControlLabel
              control={<Checkbox checked={selected.disabled ?? false} />}
              label="Deaktiviert"
              onChange={onChangeDisabled}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={<Checkbox checked={selected.whatsapp ?? false} />}
              label="WhatsApp"
              onChange={onChangeWhatsapp}
            />
          </Grid>
        </Grid>
      )}
    </FormSection>
  );
};

export default CustomerGeneral;

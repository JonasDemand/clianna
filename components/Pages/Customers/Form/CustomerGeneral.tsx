import FormTextField from '@components/Form/FormInput';
import FormSection from '@components/Form/FormSection';
import { CustomerContext } from '@context/CustomerContext';
import { CustomerContextType } from '@customTypes/customer';
import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import React, { ChangeEvent, FC, useCallback, useContext } from 'react';

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
  const onChangeComment = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('comment', e.target.value),
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
          <Grid item xs={12}>
            <FormTextField
              multiline
              variant="filled"
              label="Kommentar"
              value={selected.comment ?? ''}
              onChange={onChangeComment}
            />
          </Grid>
        </Grid>
      )}
    </FormSection>
  );
};

export default CustomerGeneral;

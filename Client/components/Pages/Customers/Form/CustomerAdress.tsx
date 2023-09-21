import FormTextField from '@components/Form/FormInput';
import FormSection from '@components/Form/FormSection';
import { useCustomerContext } from '@context/CustomerContext';
import { Grid } from '@mui/material';
import React, { ChangeEvent, FC, useCallback } from 'react';

const CustomerAdress: FC = () => {
  const { selected, updateSelected } = useCustomerContext();

  const onChangeStreet = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('street', e.target.value),
    [updateSelected]
  );
  const onChangeStreetnumber = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('streetNumber', e.target.value),
    [updateSelected]
  );
  const onChangePostalcode = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('postalCode', e.target.value),
    [updateSelected]
  );
  const onChangeCity = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('city', e.target.value),
    [updateSelected]
  );

  return (
    <FormSection label="Adresse">
      {selected && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormTextField
              label="Straße"
              value={selected.street}
              onChange={onChangeStreet}
            />
          </Grid>
          <Grid item xs={6}>
            <FormTextField
              label="Hausnummer"
              value={selected.streetNumber}
              onChange={onChangeStreetnumber}
            />
          </Grid>
          <Grid item xs={6}>
            <FormTextField
              label="Postleitzahl"
              value={selected.postalCode}
              onChange={onChangePostalcode}
            />
          </Grid>
          <Grid item xs={6}>
            <FormTextField
              label="Stadt"
              value={selected.city}
              onChange={onChangeCity}
            />
          </Grid>
        </Grid>
      )}
    </FormSection>
  );
};

export default CustomerAdress;

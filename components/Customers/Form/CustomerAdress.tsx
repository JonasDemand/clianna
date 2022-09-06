import FormInput from '@components/Inputs/FormInput';
import FormSection from '@components/SideOverlay/FormSection';
import { CustomerContext } from '@context/CustomerContext';
import { CustomerContextType } from '@customTypes/customer';
import { Grid } from '@mui/material';
import { ChangeEvent, FC, useCallback, useContext } from 'react';

const CustomerAdress: FC = () => {
  const { selected, updateSelected } = useContext(
    CustomerContext
  ) as CustomerContextType;

  const onChangeStreet = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('street', e.target.value),
    [updateSelected]
  );
  const onChangeStreetnumber = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('streetnumber', e.target.value),
    [updateSelected]
  );
  const onChangePostalcode = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('postalcode', e.target.value),
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
            <FormInput
              label="Straße"
              value={selected.street}
              onChange={onChangeStreet}
            />
          </Grid>
          <Grid item xs={6}>
            <FormInput
              label="Hausnummer"
              value={selected.streetnumber}
              onChange={onChangeStreetnumber}
            />
          </Grid>
          <Grid item xs={6}>
            <FormInput
              label="Postleitzahl"
              value={selected.postalcode}
              onChange={onChangePostalcode}
            />
          </Grid>
          <Grid item xs={6}>
            <FormInput
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

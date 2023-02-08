import FormTextField from '@components/Form/FormInput';
import FormSection from '@components/Form/FormSection';
import { CustomerContext } from '@context/CustomerContext';
import { CustomerContextType } from '@customTypes/customer';
import { Email, Phone, Smartphone } from '@mui/icons-material';
import { Grid, IconButton } from '@mui/material';
import React, {
  ChangeEvent,
  FC,
  useCallback,
  useContext,
  useState,
} from 'react';

const CustomerBasedata: FC = () => {
  const { selected, updateSelected } = useContext(
    CustomerContext
  ) as CustomerContextType;
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [mobileFocused, setMobileFocused] = useState(false);

  const onChangeFirstname = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('firstname', e.target.value),
    [updateSelected]
  );
  const onChangeLastname = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('lastname', e.target.value),
    [updateSelected]
  );
  const onChangePhone = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('phone', e.target.value),
    [updateSelected]
  );
  const onChangeMobile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('mobile', e.target.value),
    [updateSelected]
  );
  const onChangeEmail = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('email', e.target.value),
    [updateSelected]
  );
  const onChangeShoesize = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('shoesize', parseFloat(e.target.value)),
    [updateSelected]
  );
  const onChangeFibu = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('fibu', parseInt(e.target.value)),
    [updateSelected]
  );

  const onFocusPhone = useCallback(
    () => setPhoneFocused(true),
    [setPhoneFocused]
  );
  const onFocusMobile = useCallback(
    () => setMobileFocused(true),
    [setMobileFocused]
  );
  const onFocusEmail = useCallback(
    () => setEmailFocused(true),
    [setEmailFocused]
  );

  const onBlurPhone = useCallback(
    () => setPhoneFocused(false),
    [setPhoneFocused]
  );
  const onBlurMobile = useCallback(
    () => setMobileFocused(false),
    [setMobileFocused]
  );
  const onBlurEmail = useCallback(
    () => setEmailFocused(false),
    [setEmailFocused]
  );

  return (
    <FormSection label="Stammdaten">
      {selected && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormTextField
              label="Vorname"
              value={selected.firstname}
              onChange={onChangeFirstname}
            />
          </Grid>
          <Grid item xs={6}>
            <FormTextField
              label="Nachname"
              value={selected.lastname}
              onChange={onChangeLastname}
            />
          </Grid>
          <Grid item xs={6}>
            <FormTextField
              type="tel"
              label="Festnetztelefon"
              value={selected.phone}
              onFocus={onFocusPhone}
              onBlur={onBlurPhone}
              onChange={onChangePhone}
              InputProps={{
                endAdornment: (
                  <IconButton
                    disabled={!selected.phone || phoneFocused}
                    onClick={() => {
                      selected.phone &&
                        (window.location.href = `tel: ${selected.phone}`);
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    <Phone />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormTextField
              type="tel"
              label="Mobiltelefon"
              value={selected.mobile}
              onFocus={onFocusMobile}
              onBlur={onBlurMobile}
              onChange={onChangeMobile}
              InputProps={{
                endAdornment: (
                  <IconButton
                    disabled={!selected.mobile || mobileFocused}
                    onClick={() => {
                      selected.mobile &&
                        (window.location.href = `tel: ${selected.mobile}`);
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    <Smartphone />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormTextField
              type="email"
              label="E-Mail"
              value={selected.email}
              onFocus={onFocusEmail}
              onBlur={onBlurEmail}
              onChange={onChangeEmail}
              InputProps={{
                endAdornment: (
                  <IconButton
                    disabled={!selected.email || emailFocused}
                    onClick={() => {
                      selected.email &&
                        (window.location.href = `mailto: ${selected.email}`);
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    <Email />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormTextField
              type="number"
              label="Schuhgröße"
              value={selected.shoesize}
              inputProps={{
                step: '.5',
              }}
              onChange={onChangeShoesize}
            />
          </Grid>
          <Grid item xs={6}>
            <FormTextField
              type="number"
              label="FiBu-ID"
              value={selected.fibu}
              onChange={onChangeFibu}
            />
          </Grid>
        </Grid>
      )}
    </FormSection>
  );
};

export default CustomerBasedata;

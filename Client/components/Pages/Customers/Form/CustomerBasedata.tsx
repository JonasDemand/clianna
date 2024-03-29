'use client';

import EnumSelect from '@components/Form/EnumSelect';
import FormTextField from '@components/Form/FormInput';
import FormSection from '@components/Form/FormSection';
import { CustomerSalutationLabels } from '@consts/customer';
import { useCustomerContext } from '@context/CustomerContext';
import { Email, Phone, Smartphone } from '@mui/icons-material';
import { Grid, IconButton } from '@mui/material';
import { ECustomerSalutation } from '@utils/api/generated/Api';
import React, { ChangeEvent, FC, useCallback, useState } from 'react';

const CustomerBasedata: FC = () => {
  const { selected, updateSelected } = useCustomerContext();
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [mobileFocused, setMobileFocused] = useState(false);

  const onChangeFirstname = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('firstName', e.target.value),
    [updateSelected]
  );
  const onChangeLastname = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('lastName', e.target.value),
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
      updateSelected('shoeSize', parseFloat(e.target.value)),
    [updateSelected]
  );
  const onChangeSalutation = useCallback(
    (value: ECustomerSalutation) => updateSelected('salutation', value),
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
          <Grid item xs={2}>
            <EnumSelect
              label="Anrede"
              enumToUse={ECustomerSalutation}
              enumLabel={CustomerSalutationLabels}
              value={selected.salutation ?? ''}
              aditionalTextFieldProps={{
                variant: 'filled',
              }}
              onChange={onChangeSalutation}
            />
          </Grid>
          <Grid item xs={4}>
            <FormTextField
              label="Vorname"
              value={selected.firstName}
              onChange={onChangeFirstname}
            />
          </Grid>
          <Grid item xs={6}>
            <FormTextField
              label="Nachname"
              value={selected.lastName}
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
                      window.location.href = `tel:${encodeURIComponent(
                        selected.phone!
                      )}`;
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
                      window.location.href = `tel:${encodeURIComponent(
                        selected.mobile!
                      )}`;
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
                      //TODO: add message templates
                      window.location.href = `mailto:${encodeURIComponent(
                        selected.email!
                      )}`;
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
              value={selected.shoeSize}
              inputProps={{
                step: '.5',
              }}
              onChange={onChangeShoesize}
            />
          </Grid>
        </Grid>
      )}
    </FormSection>
  );
};

export default CustomerBasedata;

import MuiTextField from '@components/External/MuiTextField';
import EnumRadioList from '@components/Form/EnumRadioList';
import EnumSelect from '@components/Form/EnumSelect';
import FormTextField from '@components/Form/FormInput';
import FormSection from '@components/Form/FormSection';
import {
  OrderShippingTypeLabels,
  OrderTaxLabels,
  OrderTypeLabels,
} from '@consts/order';
import { useOrderContext } from '@context/OrderContext';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
} from '@mui/material';
import {
  Customer,
  EOrderShippingType,
  EOrderTax,
  EOrderType,
} from '@utils/api/generated/Api';
import { getCustomerLabel } from '@utils/customer';
import dayjs from 'dayjs';
import React, { ChangeEvent, FC, KeyboardEvent, useCallback } from 'react';

const OrderGeneral: FC = () => {
  const { selected, updateSelected, customers } = useOrderContext();

  const onChangePending = useCallback(
    (_: unknown, checked: boolean) => updateSelected('pending', checked),
    [updateSelected]
  );
  const onChangeType = useCallback(
    (value: EOrderType) => updateSelected('type', value),
    [updateSelected]
  );
  const onChangeCustomer = useCallback(
    (_: unknown, value: Customer | null) =>
      updateSelected('customer', value ?? undefined),
    [updateSelected]
  );
  const onChangeComment = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('comment', e.target.value),
    [updateSelected]
  );
  const onChangeShippingtype = useCallback(
    (value: EOrderShippingType) => updateSelected('shippingType', value),
    [updateSelected]
  );
  const onChangeTaxes = useCallback(
    (value: EOrderTax) => updateSelected('taxes', value),
    [updateSelected]
  );

  const renderInputCustomer = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <MuiTextField {...params} variant="filled" label="Kunde" />
    ),
    []
  );

  const onKeyDownPrice = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (selected?.price === null || selected?.price === undefined) return;
      if (e.key === 'Backspace') {
        updateSelected('price', selected?.price / 10);
        return;
      }
      if (isNaN(parseInt(e.key))) return;

      const newVal = parseFloat(selected.price.toFixed(2) + e.key);
      updateSelected('price', newVal * 10);
    },
    [selected?.price, updateSelected]
  );

  return (
    <FormSection label="Allgemein">
      {selected && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={selected.pending ?? false} />}
              label="Ausstehend"
              onChange={onChangePending}
            />
          </Grid>
          <Grid item xs={6}>
            <EnumSelect
              label="Typ"
              enumToUse={EOrderType}
              enumLabel={OrderTypeLabels}
              value={selected.type ?? ''}
              aditionalTextFieldProps={{
                variant: 'filled',
              }}
              onChange={onChangeType}
            />
          </Grid>
          <Grid item xs={6}>
            <FormTextField
              label="Preis"
              type="number"
              value={selected.price?.toFixed(2) ?? ''}
              onKeyDown={onKeyDownPrice}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">€</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              openOnFocus
              options={customers}
              value={selected.customer ?? null}
              onChange={onChangeCustomer}
              getOptionLabel={getCustomerLabel}
              renderInput={renderInputCustomer}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Grid>
          <Grid item xs={6}>
            <FormTextField
              label="Erstellungsdatum"
              type="date"
              disabled
              InputLabelProps={{
                shrink: true,
              }}
              value={dayjs(selected.creationDate ?? new Date()).format(
                'YYYY-MM-DD'
              )}
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
          <Grid item xs={6}>
            <EnumRadioList
              label="Versandtyp"
              enumToUse={EOrderShippingType}
              enumLabel={OrderShippingTypeLabels}
              value={selected.shippingType ?? ''}
              onChange={onChangeShippingtype}
            />
          </Grid>
          <Grid item xs={6}>
            <EnumRadioList
              label="Steuer"
              enumToUse={EOrderTax}
              enumLabel={OrderTaxLabels}
              value={selected.taxes ?? ''}
              onChange={onChangeTaxes}
            />
          </Grid>
        </Grid>
      )}
    </FormSection>
  );
};

export default OrderGeneral;

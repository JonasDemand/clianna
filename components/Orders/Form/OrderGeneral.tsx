import EnumRadioList from '@components/Inputs/EnumRadioList';
import EnumSelect from '@components/Inputs/EnumSelect';
import FormInput from '@components/Inputs/FormInput';
import FormSection from '@components/SideOverlay/FormSection';
import {
  OrderShippingTypeLabels,
  OrderTaxLabels,
  OrderTypeLabels,
} from '@consts/order';
import { OrderContext } from '@context/OrderContext';
import { ICustomer } from '@customTypes/database/customer';
import { OrderContextType } from '@customTypes/order';
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  TextField,
} from '@mui/material';
import { EOrderShippingType, EOrderTax, EOrderType } from '@prisma/client';
import { getCustomerLabel } from '@utils/customer';
import { ChangeEvent, FC, useCallback, useContext } from 'react';

const OrderGeneral: FC = () => {
  const { selected, updateSelected, customers } = useContext(
    OrderContext
  ) as OrderContextType;

  const onChangePending = useCallback(
    (_: unknown, checked: boolean) => updateSelected('pending', checked),
    [updateSelected]
  );
  const onChangeType = useCallback(
    (value: EOrderType) => updateSelected('type', value),
    [updateSelected]
  );
  const onChangePrice = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('price', parseFloat(e.target.value)),
    [updateSelected]
  );
  const onChangeCustomer = useCallback(
    (_: unknown, value: ICustomer | null) => updateSelected('customer', value),
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
    (value: EOrderTax | null) => updateSelected('taxes', value),
    [updateSelected]
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
            <FormInput
              label="Preis"
              type="number"
              value={selected.price ?? ''}
              onChange={onChangePrice}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">€</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              openOnFocus
              options={customers}
              value={selected.customer}
              onChange={onChangeCustomer}
              getOptionLabel={getCustomerLabel}
              renderInput={(params) => (
                <TextField {...params} variant="filled" label="Kunde" />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Grid>
          <Grid item xs={12}>
            <FormInput
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
              value={selected.taxes}
              onChange={onChangeTaxes}
            />
          </Grid>
        </Grid>
      )}
    </FormSection>
  );
};

export default OrderGeneral;

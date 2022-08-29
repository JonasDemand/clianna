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
import { IOrderWithCustomer } from '@customTypes/database/order';
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
import { getCustomerDisplay } from '@utils/customer';
import { FC, useContext } from 'react';

const OrderGeneral: FC = () => {
  const { selected, setSelected, customers } = useContext(
    OrderContext
  ) as OrderContextType;

  return (
    <FormSection label="Allgemein">
      {selected && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={selected.pending ?? false} />}
              label="Ausstehend"
              onChange={(_, checked) =>
                setSelected({
                  ...(selected as IOrderWithCustomer),
                  pending: checked,
                })
              }
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
              onChange={(value) =>
                setSelected({
                  ...(selected as IOrderWithCustomer),
                  type: value,
                })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <FormInput
              label="Preis"
              type="number"
              value={selected.price ?? ''}
              onChange={(e) =>
                setSelected({
                  ...(selected as IOrderWithCustomer),
                  price: parseFloat(e.target.value),
                })
              }
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
              onChange={(_, value) =>
                setSelected({
                  ...(selected as IOrderWithCustomer),
                  customer: value,
                  customerId: value?.id ?? null,
                })
              }
              getOptionLabel={getCustomerDisplay}
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
              onChange={(e) =>
                setSelected({
                  ...(selected as IOrderWithCustomer),
                  comment: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <EnumRadioList
              label="Versandtyp"
              enumToUse={EOrderShippingType}
              enumLabel={OrderShippingTypeLabels}
              value={selected.shippingType ?? ''}
              onChange={(value) =>
                setSelected({
                  ...(selected as IOrderWithCustomer),
                  shippingType: value,
                })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <EnumRadioList
              label="Steuer"
              enumToUse={EOrderTax}
              enumLabel={OrderTaxLabels}
              value={selected.taxes}
              onChange={(value) =>
                setSelected({
                  ...(selected as IOrderWithCustomer),
                  taxes: value,
                })
              }
            />
          </Grid>
        </Grid>
      )}
    </FormSection>
  );
};

export default OrderGeneral;

import EnumRadioList from '@components/Inputs/EnumRadioList';
import EnumSelect from '@components/Inputs/EnumSelect';
import FormInput from '@components/Inputs/FormInput';
import { OrderTypeLabels, ShippingTypeLabels, TaxLabels } from '@consts/order';
import { OrderContext } from '@context/OrderContext';
import {
  EOrderType,
  EShippingType,
  ETax,
  IOrderWithCustomer,
} from '@customTypes/database/order';
import { OrderContextType } from '@customTypes/order';
import { FormControl, FormLabel, Grid, InputAdornment } from '@mui/material';
import { FC, useContext } from 'react';

const OrderGeneral: FC = () => {
  const { selected, setSelected } = useContext(
    OrderContext
  ) as OrderContextType;

  return (
    <FormControl fullWidth>
      <FormLabel sx={{ mb: 1 }}>Allgemein</FormLabel>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <EnumSelect
            label="Typ"
            enumToUse={EOrderType}
            enumLabel={OrderTypeLabels}
            value={selected?.type ?? ''}
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
            value={selected?.price ?? ''}
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
          <FormInput
            multiline
            variant="filled"
            label="Kommentar"
            value={selected?.comment ?? ''}
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
            label="Versand"
            enumToUse={EShippingType}
            enumLabel={ShippingTypeLabels}
            value={selected?.shippingType ?? ''}
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
            enumToUse={ETax}
            enumLabel={TaxLabels}
            value={selected?.taxes ?? ''}
            onChange={(value) =>
              setSelected({
                ...(selected as IOrderWithCustomer),
                taxes: value,
              })
            }
          />
        </Grid>
      </Grid>
    </FormControl>
  );
};

export default OrderGeneral;

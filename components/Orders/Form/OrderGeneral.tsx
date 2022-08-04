import EnumSelect from '@components/Inputs/EnumSelect';
import FormInput from '@components/Inputs/FormInput';
import { OrderContext } from '@context/OrderContext';
import {
  IOrderWithCustomer,
  OrderType,
  OrderTypeLabels,
  ShippingType,
  ShippingTypeLabels,
  Tax,
  TaxLabels,
} from '@customTypes/database/order';
import { OrderContextType } from '@customTypes/order';
import { FormControl, FormLabel, Grid } from '@mui/material';
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
            variant="filled"
            autocomplete
            label="Typ"
            enumToUse={OrderType}
            enumLabel={OrderTypeLabels}
            value={selected?.type}
            onChange={(value) =>
              setSelected({
                ...(selected as IOrderWithCustomer),
                type: value,
              })
            }
          />
        </Grid>
        <Grid item xs={6}>
          <EnumSelect
            variant="filled"
            autocomplete
            label="Versand"
            enumToUse={ShippingType}
            enumLabel={ShippingTypeLabels}
            value={selected?.shippingType}
            onChange={(value) =>
              setSelected({
                ...(selected as IOrderWithCustomer),
                shippingType: value,
              })
            }
          />
        </Grid>
        <Grid item xs={6}>
          <FormInput
            label="Preis"
            value={selected?.price ?? ''}
            onChange={(e) =>
              setSelected({
                ...(selected as IOrderWithCustomer),
                price: parseFloat(e.target.value),
              })
            }
          />
        </Grid>
        <Grid item xs={6}>
          <EnumSelect
            variant="filled"
            autocomplete
            label="Steuer"
            enumToUse={Tax}
            enumLabel={TaxLabels}
            value={selected?.taxes}
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

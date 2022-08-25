import EnumSelect from '@components/Inputs/EnumSelect';
import { OrderContext } from '@context/OrderContext';
import { EOrderBrand, IOrderWithCustomer } from '@customTypes/database/order';
import { OrderContextType } from '@customTypes/order';
import { Grid } from '@mui/material';
import { FC, useContext } from 'react';

const Schuhbestellung: FC = () => {
  const { selected, setSelected } = useContext(
    OrderContext
  ) as OrderContextType;
  return (
    <>
      {selected && (
        <>
          <Grid item xs={6}>
            <EnumSelect
              autocomplete
              label="Hersteller"
              enumToUse={EOrderBrand}
              value={selected.brand ?? ''}
              aditionalTextFieldProps={{
                variant: 'filled',
              }}
              onChange={(value) =>
                setSelected({
                  ...(selected as IOrderWithCustomer),
                  brand: value as string,
                })
              }
            />
          </Grid>
        </>
      )}
    </>
  );
};

export default Schuhbestellung;

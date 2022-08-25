import EnumSelect from '@components/Inputs/EnumSelect';
import FormInput from '@components/Inputs/FormInput';
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
              freeSolo
              label="Hersteller"
              enumToUse={EOrderBrand}
              inputValue={selected.brand}
              aditionalTextFieldProps={{
                variant: 'filled',
              }}
              onInputChange={(value) =>
                setSelected({
                  ...(selected as IOrderWithCustomer),
                  brand: value,
                })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <FormInput
              label="Artikel"
              type="text"
              value={selected.article ?? ''}
              onChange={(e) =>
                setSelected({
                  ...(selected as IOrderWithCustomer),
                  article: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <FormInput
              label="Farbe"
              type="text"
              value={selected.color ?? ''}
              onChange={(e) =>
                setSelected({
                  ...(selected as IOrderWithCustomer),
                  color: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <FormInput
              label="Händler"
              type="text"
              value={selected.dealer ?? ''}
              onChange={(e) =>
                setSelected({
                  ...(selected as IOrderWithCustomer),
                  dealer: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <FormInput
              label="Größe"
              type="number"
              value={selected.size ?? ''}
              inputProps={{
                step: '.5',
              }}
              onChange={(e) =>
                setSelected({
                  ...(selected as IOrderWithCustomer),
                  size: parseFloat(e.target.value),
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

import FormInput from '@components/Inputs/FormInput';
import { OrderContext } from '@context/OrderContext';
import { IOrderWithCustomer } from '@customTypes/database/order';
import { OrderContextType } from '@customTypes/order';
import { Grid } from '@mui/material';
import { FC, useContext } from 'react';

import { DuedatePicker } from './CommonInputs';

const Miscellaneous: FC = () => {
  const { selected, setSelected } = useContext(
    OrderContext
  ) as OrderContextType;
  return (
    <>
      {selected && (
        <>
          <Grid item xs={6}>
            <DuedatePicker />
          </Grid>
          <Grid item xs={6}>
            <FormInput
              multiline
              variant="filled"
              label="Name"
              value={selected.name ?? ''}
              onChange={(e) =>
                setSelected({
                  ...(selected as IOrderWithCustomer),
                  name: e.target.value,
                })
              }
            />
          </Grid>
        </>
      )}
    </>
  );
};

export default Miscellaneous;

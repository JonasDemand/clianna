import FormInput from '@components/Inputs/FormInput';
import { OrderContext } from '@context/OrderContext';
import { OrderContextType } from '@customTypes/order';
import { Grid } from '@mui/material';
import { ChangeEvent, FC, useCallback, useContext } from 'react';

import { DuedatePicker } from './CommonInputs';

const Miscellaneous: FC = () => {
  const { selected, updateSelected } = useContext(
    OrderContext
  ) as OrderContextType;

  const onChangeName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('name', e.target.value),
    [updateSelected]
  );

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
              onChange={onChangeName}
            />
          </Grid>
        </>
      )}
    </>
  );
};

export default Miscellaneous;

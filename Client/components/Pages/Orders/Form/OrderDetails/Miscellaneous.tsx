import FormTextField from '@components/Form/FormInput';
import { useOrderContext } from '@context/OrderContext';
import { Grid } from '@mui/material';
import React, { ChangeEvent, FC, useCallback } from 'react';

import { DuedatePicker } from './CommonInputs';

const Miscellaneous: FC = () => {
  const { selected, updateSelected } = useOrderContext();

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
            <FormTextField
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

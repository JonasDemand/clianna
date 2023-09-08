import { Grid } from '@mui/material';
import React, { FC } from 'react';

import { DuedatePicker } from './CommonInputs';

const Massschuhleisten: FC = () => {
  return (
    <>
      <Grid item xs={6}>
        <DuedatePicker />
      </Grid>
    </>
  );
};

export default Massschuhleisten;

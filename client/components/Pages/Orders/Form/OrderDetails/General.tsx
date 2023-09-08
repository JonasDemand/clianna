import { Grid } from '@mui/material';
import React, { FC } from 'react';

import { DuedatePicker } from './CommonInputs';

const General: FC = () => (
  <>
    <Grid item xs={6}>
      <DuedatePicker />
    </Grid>
  </>
);

export default General;

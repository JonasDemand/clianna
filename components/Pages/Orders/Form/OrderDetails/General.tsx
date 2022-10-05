import { Grid } from '@mui/material';
import React, { FC } from 'react';

import { DuedatePicker, SpecificationSelect } from './CommonInputs';

const General: FC = () => (
  <>
    <Grid item xs={6}>
      <DuedatePicker />
    </Grid>
    <Grid item xs={6}>
      <SpecificationSelect />
    </Grid>
  </>
);

export default General;

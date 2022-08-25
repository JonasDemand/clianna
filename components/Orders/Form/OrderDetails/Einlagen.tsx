import { Grid } from '@mui/material';
import { FC } from 'react';

import { DuedatePicker, SpecificationSelect } from './CommonInputs';

const Einlagen: FC = () => (
  <>
    <Grid item xs={6}>
      <DuedatePicker />
    </Grid>
    <Grid item xs={6}>
      <SpecificationSelect />
    </Grid>
  </>
);

export default Einlagen;

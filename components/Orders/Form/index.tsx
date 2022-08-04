import { Grid } from '@mui/material';
import { FC } from 'react';

import OrderGeneral from './OrderGeneral';

const OrderFrom: FC = () => (
  <Grid container direction="column" spacing={2}>
    <Grid item>
      <OrderGeneral />
    </Grid>
  </Grid>
);

export default OrderFrom;

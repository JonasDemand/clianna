import { Grid } from '@mui/material';
import { FC } from 'react';

import OrderDetails from './OrderDetails';
import OrderGeneral from './OrderGeneral';

const OrderFrom: FC = () => (
  <Grid container direction="column" spacing={2}>
    <Grid item>
      <OrderGeneral />
    </Grid>
    <Grid item>
      <OrderDetails />
    </Grid>
  </Grid>
);

export default OrderFrom;

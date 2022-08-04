import { Grid } from '@mui/material';
import { FC } from 'react';

import CustomerAdress from './CustomerAdress';
import CustomerBasedata from './CustomerBasedata';
import CustomerFormHeader from './CustomerFormHeader';

const CustomerForm: FC = () => (
  <Grid container direction="column" spacing={1}>
    <Grid item>
      <CustomerFormHeader />
    </Grid>
    <Grid item>
      <CustomerBasedata />
    </Grid>
    <Grid item>
      <CustomerAdress />
    </Grid>
  </Grid>
);

export default CustomerForm;

import DocumentForm from '@components/Form/DocumentForm';
import { Grid } from '@mui/material';
import { FC } from 'react';

import CustomerAdress from './CustomerAdress';
import CustomerBasedata from './CustomerBasedata';
import CustomerGeneral from './CustomerGeneral';

const CustomerForm: FC = () => (
  <Grid container direction="column" spacing={2}>
    <Grid item>
      <CustomerGeneral />
    </Grid>
    <Grid item>
      <CustomerBasedata />
    </Grid>
    <Grid item>
      <CustomerAdress />
    </Grid>
    <Grid item>
      <DocumentForm />
    </Grid>
  </Grid>
);

export default CustomerForm;

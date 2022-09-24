import DocumentForm from '@components/Form/DocumentForm';
import { CustomerContext } from '@context/CustomerContext';
import { CustomerContextType } from '@customTypes/customer';
import { Grid } from '@mui/material';
import { FC, useContext } from 'react';

import CustomerAdress from './CustomerAdress';
import CustomerBasedata from './CustomerBasedata';
import CustomerGeneral from './CustomerGeneral';

const CustomerForm: FC = () => {
  const { selected } = useContext(CustomerContext) as CustomerContextType;
  return (
    <Grid container direction="column" spacing={2}>
      {selected && (
        <>
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
            <DocumentForm documents={selected.documents} />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default CustomerForm;

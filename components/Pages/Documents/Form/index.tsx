import { Grid } from '@mui/material';
import { FC } from 'react';

import DocumentGeneral from './DocumentGeneral';

const DocumentForm: FC = () => {
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <DocumentGeneral />
      </Grid>
    </Grid>
  );
};

export default DocumentForm;

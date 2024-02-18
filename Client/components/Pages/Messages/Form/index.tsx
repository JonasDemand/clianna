import { Grid } from '@mui/material';
import React, { FC } from 'react';

import MessageContent from './MessageContent';
import MessageGeneral from './MessageGeneral';

const DocumentForm: FC = () => {
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <MessageGeneral />
      </Grid>
      <Grid item>
        <MessageContent />
      </Grid>
    </Grid>
  );
};

export default DocumentForm;

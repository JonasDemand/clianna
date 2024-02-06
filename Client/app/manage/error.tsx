'use client';

import { ErrorOutline } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import React from 'react';

const Error = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={3}
      height={1}
    >
      <Grid item>
        <ErrorOutline color="error" sx={{ fontSize: 120 }} />
      </Grid>
      <Grid item>
        <Typography textAlign="center" variant="h2" fontWeight="bold">
          Irgendwas ist schiefgelaufen..
        </Typography>
        <Typography textAlign="center" variant="h4" marginTop={1}>
          Eventuell asloggen und wieder einloggen :)
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Error;

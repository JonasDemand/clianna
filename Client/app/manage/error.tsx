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
        <ErrorOutline color="error" sx={{ fontSize: 150 }} />
      </Grid>
      <Grid
        item
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography
          textAlign="center"
          variant="h2"
          fontWeight="bold"
          width="80%"
        >
          Fehler 500 – Ups, da ist etwas schiefgegangen!
        </Typography>
        <Typography textAlign="center" variant="h4" width="70%" marginTop={1}>
          Es tut uns leid, aber es scheint, als hätte ein unerwarteter Fehler
          auf unserer Seite aufgetreten. Vielleicht hilft es, sich auszuloggen
          und erneut einzuloggen. Falls das Problem weiterhin besteht,
          kontaktieren Sie bitte unseren Support. Wir arbeiten daran, das
          Problem so schnell wie möglich zu beheben. Vielen Dank für Ihr
          Verständnis!
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Error;

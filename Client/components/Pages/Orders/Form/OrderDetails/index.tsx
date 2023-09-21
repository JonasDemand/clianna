import { useOrderContext } from '@context/OrderContext';
import { FormControl, FormLabel, Grid, Typography } from '@mui/material';
import { EOrderType } from '@utils/api/generated/Api';
import React, { FC } from 'react';

import General from './General';
import Massschuhleisten from './Massschuhleisten';
import Miscellaneous from './Miscellaneous';
import Schuhbestellung from './Schuhbestellung';

const OrderTypeFrom: FC = () => {
  const { selected } = useOrderContext();
  switch (selected?.type) {
    case EOrderType.Abrolloptimierung:
    case EOrderType.Einlagen:
    case EOrderType.Einlagenarbeiten:
    case EOrderType.Schuharbeiten:
    case EOrderType.Massschuhe:
      return <General />;
    case EOrderType.Massschuhleisten:
      return <Massschuhleisten />;
    case EOrderType.Schuhbestellung:
      return <Schuhbestellung />;
    case EOrderType.Miscellaneous:
      return <Miscellaneous />;
    default:
      return (
        <Grid item xs={12}>
          <Typography>Wähle Typ aus, um Details zu sehen</Typography>
        </Grid>
      );
  }
};

const OrderDetails: FC = () => (
  <FormControl fullWidth>
    <FormLabel sx={{ mb: 1 }}>Details</FormLabel>
    <Grid container spacing={2}>
      <OrderTypeFrom />
    </Grid>
  </FormControl>
);

export default OrderDetails;

import { OrderContext } from '@context/OrderContext';
import { EOrderType } from '@customTypes/database/order';
import { OrderContextType } from '@customTypes/order';
import { FormControl, FormLabel, Grid, Typography } from '@mui/material';
import { FC, useContext } from 'react';

import Abrolloptimierung from './Abrolloptimierung';
import Einlagen from './Einlagen';
import Einlagenarbeiten from './Einlagenarbeiten';
import Massschuhe from './Masschuhe';
import Massschuhleisten from './Massschuhleisten';
import Miscellaneous from './Miscellaneous';
import Schuharbeiten from './Schuharbeiten';
import Schuhbestellung from './Schuhbestellung';

const OrderTypeFrom: FC = () => {
  const { selected } = useContext(OrderContext) as OrderContextType;
  switch (selected?.type) {
    case EOrderType.Abrolloptimierung:
      return <Abrolloptimierung />;
    case EOrderType.Einlagen:
      return <Einlagen />;
    case EOrderType.Einlagenarbeiten:
      return <Einlagenarbeiten />;
    case EOrderType.Massschuhe:
      return <Massschuhe />;
    case EOrderType.Massschuhleisten:
      return <Massschuhleisten />;
    case EOrderType.Miscellaneous:
      return <Miscellaneous />;
    case EOrderType.Schuharbeiten:
      return <Schuharbeiten />;
    case EOrderType.Schuhbestellung:
      return <Schuhbestellung />;
    default:
      return (
        <Grid item xs={12}>
          <Typography>Wähle Typ aus, um Details zu sehen</Typography>
        </Grid>
      );
  }
};

const OrderDetails: FC = () => {
  return (
    <FormControl fullWidth>
      <FormLabel sx={{ mb: 1 }}>Details</FormLabel>
      <Grid container spacing={2}>
        <OrderTypeFrom />
      </Grid>
    </FormControl>
  );
};

export default OrderDetails;

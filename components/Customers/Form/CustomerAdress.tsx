import { FormLabel, Grid, TextField, Typography } from '@mui/material';
import { FunctionComponent, useContext } from 'react';

import {
  CustomerContextType,
  ICustomerWithOrders,
} from '../../../@types/customer';
import { CustomerContext } from '../../../context/customerContext';

const CustomerAdress: FunctionComponent = () => {
  const { selected, setSelected, selectedDisabled } = useContext(
    CustomerContext
  ) as CustomerContextType;
  return (
    <FormLabel>
      <Typography sx={{ mb: 1 }}>Adresse</Typography>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField
            variant="filled"
            fullWidth
            disabled={selectedDisabled}
            type="text"
            label="Straße"
            value={selected?.street ?? ''}
            onChange={(e) =>
              setSelected({
                ...(selected as ICustomerWithOrders),
                street: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            variant="filled"
            fullWidth
            disabled={selectedDisabled}
            type="text"
            label="Hausnummer"
            value={selected?.streetnumber ?? ''}
            onChange={(e) =>
              setSelected({
                ...(selected as ICustomerWithOrders),
                streetnumber: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            variant="filled"
            fullWidth
            disabled={selectedDisabled}
            type="text"
            label="Postleitzahl"
            value={selected?.postalcode ?? ''}
            onChange={(e) =>
              setSelected({
                ...(selected as ICustomerWithOrders),
                postalcode: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            variant="filled"
            fullWidth
            disabled={selectedDisabled}
            type="text"
            label="Stadt"
            value={selected?.city ?? ''}
            onChange={(e) =>
              setSelected({
                ...(selected as ICustomerWithOrders),
                city: e.target.value,
              })
            }
          />
        </Grid>
      </Grid>
    </FormLabel>
  );
};

export default CustomerAdress;

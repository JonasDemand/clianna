import { FormLabel, Grid, TextField, Typography } from '@mui/material';
import { FunctionComponent, useContext } from 'react';

import {
  CustomerContextType,
  ICustomerWithOrders,
} from '../../../@types/database/customer';
import { CustomerContext } from '../../../context/customerContext';

const CustomerBasedata: FunctionComponent = () => {
  const { selected, setSelected, selectedDisabled } = useContext(
    CustomerContext
  ) as CustomerContextType;
  return (
    <FormLabel>
      <Typography sx={{ mb: 1 }}>Stammdaten</Typography>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField
            variant="filled"
            fullWidth
            required
            disabled={selectedDisabled}
            type="text"
            label="Vorname"
            value={selected?.firstname ?? ''}
            onChange={(e) =>
              setSelected({
                ...(selected as ICustomerWithOrders),
                firstname: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            variant="filled"
            fullWidth
            required
            disabled={selectedDisabled}
            type="text"
            label="Nachname"
            value={selected?.lastname ?? ''}
            onChange={(e) =>
              setSelected({
                ...(selected as ICustomerWithOrders),
                lastname: e.target.value,
              })
            }
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            sx={{
              input: {
                cursor:
                  selectedDisabled && selected?.email ? 'pointer' : 'unset',
              },
            }}
            variant="filled"
            fullWidth
            disabled={selectedDisabled}
            type="email"
            label="E-Mail"
            value={selected?.email ?? ''}
            onClick={() => {
              selectedDisabled &&
                selected?.email &&
                (window.location.href = `mailto: ${selected?.email}`);
            }}
            onChange={(e) =>
              setSelected({
                ...(selected as ICustomerWithOrders),
                email: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            sx={{
              input: {
                cursor:
                  selectedDisabled && selected?.phone ? 'pointer' : 'unset',
              },
            }}
            variant="filled"
            fullWidth
            disabled={selectedDisabled}
            type="tel"
            label="Telefon"
            value={selected?.phone ?? ''}
            onClick={() => {
              selectedDisabled &&
                selected?.phone &&
                (window.location.href = `tel: ${selected?.phone}`);
            }}
            onChange={(e) =>
              setSelected({
                ...(selected as ICustomerWithOrders),
                phone: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            sx={{ width: 1 }}
            variant="filled"
            disabled={selectedDisabled}
            type="number"
            label="Schuhgröße"
            value={selected?.shoesize ?? ''}
            inputProps={{
              step: '1',
            }}
            onChange={(e) =>
              setSelected({
                ...(selected as ICustomerWithOrders),
                shoesize: parseFloat(
                  e.target.value.replace('[^0-9.]', '') ?? ''
                ),
              })
            }
          />
        </Grid>
      </Grid>
    </FormLabel>
  );
};

export default CustomerBasedata;

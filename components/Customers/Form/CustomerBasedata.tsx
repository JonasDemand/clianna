import { CustomerContext } from '@context/CustomerContext';
import { CustomerContextType } from '@customTypes/customer';
import { ICustomerWithOrders } from '@customTypes/database/customer';
import { Email, Phone } from '@mui/icons-material';
import {
  FormLabel,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useContext, useState } from 'react';

const CustomerBasedata: FC = () => {
  const { selected, setSelected } = useContext(
    CustomerContext
  ) as CustomerContextType;
  const [emailFocused, setEmailFocused] = useState(false);
  const [telFocused, setTelFocused] = useState(false);

  return (
    <FormLabel>
      <Typography sx={{ mb: 1 }}>Stammdaten</Typography>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField
            variant="filled"
            fullWidth
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
            variant="filled"
            fullWidth
            type="email"
            label="E-Mail"
            value={selected?.email ?? ''}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            onChange={(e) =>
              setSelected({
                ...(selected as ICustomerWithOrders),
                email: e.target.value,
              })
            }
            InputProps={{
              endAdornment: (
                <IconButton
                  disabled={!selected?.email || emailFocused}
                  onClick={() => {
                    selected?.email &&
                      (window.location.href = `mailto: ${selected?.email}`);
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  <Email />
                </IconButton>
              ),
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            variant="filled"
            fullWidth
            type="tel"
            label="Telefon"
            value={selected?.phone ?? ''}
            onFocus={() => setTelFocused(true)}
            onBlur={() => setTelFocused(false)}
            onChange={(e) =>
              setSelected({
                ...(selected as ICustomerWithOrders),
                phone: e.target.value,
              })
            }
            InputProps={{
              endAdornment: (
                <IconButton
                  disabled={!selected?.phone || telFocused}
                  onClick={() => {
                    selected?.phone &&
                      (window.location.href = `tel: ${selected?.phone}`);
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  <Phone />
                </IconButton>
              ),
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            sx={{ width: 1 }}
            variant="filled"
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

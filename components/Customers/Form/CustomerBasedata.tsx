import FormInput from '@components/Inputs/FormInput';
import { CustomerContext } from '@context/CustomerContext';
import { CustomerContextType } from '@customTypes/customer';
import { ICustomerWithOrders } from '@customTypes/database/customer';
import { Email, Phone, Smartphone } from '@mui/icons-material';
import { FormLabel, Grid, IconButton, Typography } from '@mui/material';
import { FC, useContext, useState } from 'react';

const CustomerBasedata: FC = () => {
  const { selected, setSelected } = useContext(
    CustomerContext
  ) as CustomerContextType;
  const [emailFocused, setEmailFocused] = useState(false);
  const [telFocused, setTelFocused] = useState(false);
  const [mobileFocused, setMobileFocused] = useState(false);

  return (
    <FormLabel>
      <Typography sx={{ mb: 1 }}>Stammdaten</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormInput
            label="Vorname"
            value={selected?.firstname}
            onChange={(e) =>
              setSelected({
                ...(selected as ICustomerWithOrders),
                firstname: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={6}>
          <FormInput
            label="Nachname"
            value={selected?.lastname}
            onChange={(e) =>
              setSelected({
                ...(selected as ICustomerWithOrders),
                lastname: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={6}>
          <FormInput
            type="tel"
            label="Festnetztelefon"
            value={selected?.phone}
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
          <FormInput
            type="tel"
            label="Mobiltelefon"
            value={selected?.mobile}
            onFocus={() => setMobileFocused(true)}
            onBlur={() => setMobileFocused(false)}
            onChange={(e) =>
              setSelected({
                ...(selected as ICustomerWithOrders),
                mobile: e.target.value,
              })
            }
            InputProps={{
              endAdornment: (
                <IconButton
                  disabled={!selected?.mobile || mobileFocused}
                  onClick={() => {
                    selected?.mobile &&
                      (window.location.href = `tel: ${selected?.mobile}`);
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  <Smartphone />
                </IconButton>
              ),
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <FormInput
            type="email"
            label="E-Mail"
            value={selected?.email}
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
          <FormInput
            type="number"
            label="Schuhgröße"
            value={selected?.shoesize}
            inputProps={{
              step: '.5',
            }}
            onChange={(e) =>
              setSelected({
                ...(selected as ICustomerWithOrders),
                shoesize: parseFloat(e.target.value),
              })
            }
          />
        </Grid>
      </Grid>
    </FormLabel>
  );
};

export default CustomerBasedata;

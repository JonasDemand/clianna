import { FormLabel, Box, TextField, Typography } from '@mui/material';
import { FunctionComponent, useContext, ChangeEvent } from 'react';
import {
  CustomerContextType,
  ICustomerWithOrders,
} from '../../../@types/customer';
import { CustomerContext } from '../../../context/customerContext';

const CustomerBasedata: FunctionComponent = () => {
  const { selected, setSelected, selectedDisabled } = useContext(
    CustomerContext
  ) as CustomerContextType;
  return (
    <FormLabel>
      <Typography sx={{ pt: 1 }}>Stammdaten</Typography>
      <Box sx={{ display: 'flex', pt: 1 }}>
        <TextField
          sx={{ pr: 1 }}
          variant="filled"
          fullWidth
          required
          disabled={selectedDisabled}
          type="text"
          label="Vorname"
          name="firstname"
          value={selected?.firstname}
          onChange={(e) =>
            setSelected({
              ...(selected as ICustomerWithOrders),
              firstname: e.target.value,
            })
          }
        />
        <TextField
          sx={{ pl: 1 }}
          variant="filled"
          fullWidth
          required
          disabled={selectedDisabled}
          type="text"
          label="Nachname"
          name="lastname"
          value={selected?.lastname}
          onChange={(e) =>
            setSelected({
              ...(selected as ICustomerWithOrders),
              lastname: e.target.value,
            })
          }
        />
      </Box>
      <Box sx={{ display: 'flex', pt: 1 }}>
        <TextField
          sx={{
            pr: 1,
            input: { cursor: selectedDisabled ? 'pointer' : 'text' },
          }}
          variant="filled"
          fullWidth
          disabled={selectedDisabled}
          type="email"
          label="E-Mail"
          name="email"
          value={selected?.email}
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
        <TextField
          sx={{
            pl: 1,
            input: { cursor: selectedDisabled ? 'pointer' : 'text' },
          }}
          variant="filled"
          fullWidth
          disabled={selectedDisabled}
          type="text"
          label="Telefon"
          name="phone"
          value={selected?.phone}
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
      </Box>
      <Box sx={{ display: 'flex', pt: 1 }}>
        <TextField
          sx={{ width: 0.5, pr: 1 }}
          variant="filled"
          disabled={selectedDisabled}
          type="number"
          label="Schuhgröße"
          name="shoesize"
          value={selected?.shoesize}
          onChange={(e) =>
            setSelected({
              ...(selected as ICustomerWithOrders),
              shoesize: parseFloat(e.target.value),
            })
          }
        />
      </Box>
    </FormLabel>
  );
};

export default CustomerBasedata;

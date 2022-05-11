import { FormLabel, Box, TextField, Typography } from '@mui/material';
import { FunctionComponent, useContext, ChangeEvent } from 'react';
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
      <Typography sx={{ pt: 1 }}>Adresse</Typography>
      <Box sx={{ display: 'flex', pt: 1 }}>
        <TextField
          sx={{ pr: 1 }}
          variant="filled"
          fullWidth
          disabled={selectedDisabled}
          type="text"
          label="Straße"
          name="street"
          value={selected?.street}
          onChange={(e) =>
            setSelected({
              ...(selected as ICustomerWithOrders),
              street: e.target.value,
            })
          }
        />
        <TextField
          sx={{ pl: 1 }}
          variant="filled"
          fullWidth
          disabled={selectedDisabled}
          type="text"
          label="Hausnummer"
          name="streetnumber"
          value={selected?.streetnumber}
          onChange={(e) =>
            setSelected({
              ...(selected as ICustomerWithOrders),
              streetnumber: e.target.value,
            })
          }
        />
      </Box>
      <Box sx={{ display: 'flex', pt: 1 }}>
        <TextField
          sx={{ pr: 1 }}
          variant="filled"
          fullWidth
          disabled={selectedDisabled}
          type="text"
          label="Postleitzahl"
          name="postalcode"
          value={selected?.postalcode}
          onChange={(e) =>
            setSelected({
              ...(selected as ICustomerWithOrders),
              postalcode: e.target.value,
            })
          }
        />
        <TextField
          sx={{ pl: 1 }}
          variant="filled"
          fullWidth
          disabled={selectedDisabled}
          type="text"
          label="Stadt"
          name="city"
          value={selected?.city}
          onChange={(e) =>
            setSelected({
              ...(selected as ICustomerWithOrders),
              city: e.target.value,
            })
          }
        />
      </Box>
    </FormLabel>
  );
};

export default CustomerAdress;

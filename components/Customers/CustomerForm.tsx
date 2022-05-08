import {
  Box,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from '@mui/material';
import { ChangeEvent, FunctionComponent, useContext } from 'react';
import {
  CustomerContextType,
  ICustomerWithOrders,
} from '../../@types/customer';
import { CustomerContext } from '../../context/customerContext';

const CustomerBasedata: FunctionComponent = () => {
  const { selected, setSelected } = useContext(
    CustomerContext
  ) as CustomerContextType;
  return (
    <FormLabel>
      Stammdaten
      <Box sx={{ display: 'flex', pt: 1 }}>
        <TextField
          sx={{ pr: 1 }}
          variant="filled"
          fullWidth
          label="Vorname"
          value={selected?.firstname}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
          label="Nachname"
          value={selected?.lastname}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSelected({
              ...(selected as ICustomerWithOrders),
              lastname: e.target.value,
            })
          }
        />
      </Box>
      <Box sx={{ display: 'flex', pt: 1 }}>
        <TextField
          sx={{ pr: 1 }}
          variant="filled"
          fullWidth
          label="E-Mail"
          value={selected?.email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSelected({
              ...(selected as ICustomerWithOrders),
              email: e.target.value,
            })
          }
        />
        <TextField
          sx={{ pl: 1 }}
          variant="filled"
          fullWidth
          label="Telefon"
          value={selected?.phone}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSelected({
              ...(selected as ICustomerWithOrders),
              phone: e.target.value,
            })
          }
        />
      </Box>
    </FormLabel>
  );
};

const CustomerAdress: FunctionComponent = () => {
  const { selected, setSelected } = useContext(
    CustomerContext
  ) as CustomerContextType;
  return (
    <FormLabel sx={{ pt: 2 }}>
      Adresse
      <Box sx={{ display: 'flex', pt: 1 }}>
        <TextField
          sx={{ pr: 1 }}
          variant="filled"
          fullWidth
          label="Straße"
          value={selected?.street}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
          label="Hausnummer"
          value={selected?.streetnumber}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
          label="Postleitzahl"
          value={selected?.postalcode}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
          label="Stadt"
          value={selected?.city}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
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

const CustomerForm: FunctionComponent = () => {
  const { selected, setSelected } = useContext(
    CustomerContext
  ) as CustomerContextType;

  return (
    <FormControl sx={{ width: 1, height: 1 }}>
      <Typography>Kunde {selected?.id}</Typography>
      <CustomerBasedata />
      <CustomerAdress />
    </FormControl>
  );
};

export default CustomerForm;

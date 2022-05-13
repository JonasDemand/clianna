import { Badge } from '@mui/icons-material';
import {
  Alert,
  AlertColor,
  Box,
  Button,
  FormControl,
  Snackbar,
  Typography,
} from '@mui/material';
import {
  FormEventHandler,
  FunctionComponent,
  MouseEventHandler,
  useContext,
  useState,
} from 'react';
import {
  CustomerContextType,
  ICustomerWithOrders,
} from '../../../@types/customer';
import { CustomerContext } from '../../../context/customerContext';
import {
  createCustomer,
  updateCustomer,
} from '../../../utils/api/requests/customers';
import CustomerAdress from './CustomerAdress';
import CustomerBasedata from './CustomerBasedata';
import CustoemrDisabled from './CustomerDisabled';

const CustomerForm: FunctionComponent = () => {
  const {
    customers,
    setCustomers,
    selected,
    setSelected,
    selectedDisabled,
    setSelectedDisabled,
  } = useContext(CustomerContext) as CustomerContextType;

  const [alert, setAlert] = useState<{
    message: string;
    severity: AlertColor;
  }>();

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!selected) return;
    let create = selected.id === 0;
    let newCustomers = [...customers];
    let newCust = selected;
    try {
      setSelectedDisabled(true);
      if (create) {
        newCust = await createCustomer(selected);
        newCustomers.push(newCust);
        newCustomers = newCustomers.sort((a, b) =>
          a.lastname.toLowerCase().localeCompare(b.lastname.toLowerCase())
        );
      } else {
        newCust = await updateCustomer(selected);
        const index = newCustomers.findIndex(
          (customer) => customer.id === newCust.id
        );
        newCustomers[index] = newCust;
      }
      setSelected(newCust);
      setCustomers(newCustomers);
      setAlert({
        message: `Erfolgreich Kunde ${newCust.id} ${
          create ? 'erstellt' : 'aktualisiert'
        }`,
        severity: 'success',
      });
    } catch {
      setAlert({
        message: `${create ? 'Erstellen' : 'Aktualisieren'} von Kunde ${
          newCust.id
        } fehlgeschlagen`,
        severity: 'error',
      });
    }
  };
  const onEnable: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setSelectedDisabled(false);
  };
  const onClose: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setSelected(null);
  };

  return (
    <FormControl
      sx={{ width: 1, height: 1, display: 'flex' }}
      component="form"
      onSubmit={onSubmit}
    >
      <Box sx={{ flex: '1 1 auto' }}>
        {selected ? (
          <>
            <CustoemrDisabled />
            <CustomerBasedata />
            <CustomerAdress />
          </>
        ) : (
          <Box sx={{ width: 1, height: 1, display: 'flex' }}>
            <Box m="auto">
              <Badge sx={{ width: 1 }} fontSize="large" color="primary" />
              <Typography fontSize="large">Kein Kunde ausgewählt</Typography>
            </Box>
          </Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', mt: 2 }}>
        {selectedDisabled ? (
          <>
            <Button
              disabled={!selected}
              fullWidth
              color="secondary"
              variant="contained"
              onClick={onEnable}
            >
              Bearbeiten
            </Button>
            <Button
              sx={{ ml: 1 }}
              disabled={!selected}
              color="error"
              fullWidth
              variant="contained"
              onClick={onClose}
            >
              Schließen
            </Button>
          </>
        ) : (
          <>
            <Button sx={{ mr: 1 }} fullWidth type="submit" variant="contained">
              Speichern
            </Button>
            <Button
              sx={{ ml: 1 }}
              fullWidth
              variant="contained"
              color="warning"
              onClick={() => setSelectedDisabled(true)}
            >
              Abbrechen
            </Button>
          </>
        )}
      </Box>
      <Snackbar
        open={!!alert}
        autoHideDuration={3000}
        onClose={(e, reason) => {
          if (reason == 'clickaway') return;
          setAlert(undefined);
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
      </Snackbar>
    </FormControl>
  );
};

export default CustomerForm;

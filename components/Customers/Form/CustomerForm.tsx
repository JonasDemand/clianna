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
import { CustomerContextType } from '../../../@types/customer';
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

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>();

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!selected) return;
    try {
      let newCustomers = [...customers];
      setSelectedDisabled(true);
      if (selected.id === 0) {
        const newCust = await createCustomer(selected);
        newCustomers.push(newCust);
        setSelected(newCust);
      } else {
        const newCust = await updateCustomer(selected);
        const index = newCustomers.findIndex(
          (customer) => customer.id === newCust.id
        );
        newCustomers[index] = newCust;
      }
      setCustomers(newCustomers);
      setAlertOpen(true);
      setAlertMessage(
        `Erfolgreich Kunde ${selected.id ?? ''} ${
          selected.id === 0 ? 'erstellt' : 'aktualisiert'
        }`
      );
      setAlertSeverity('success');
    } catch {
      setAlertOpen(true);
      setAlertMessage(
        `${selected.id === 0 ? 'Erstellen' : 'Aktualisieren'} von Kunde ${
          selected.id ?? ''
        } fehlgeschlagen`
      );
      setAlertSeverity('error');
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
  const handleAlertClose = (
    e: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;

    setAlertOpen(false);
    setAlertMessage('');
    setAlertSeverity(undefined);
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
        open={alertOpen}
        onClose={handleAlertClose}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={alertSeverity}>{alertMessage}</Alert>
      </Snackbar>
    </FormControl>
  );
};

export default CustomerForm;

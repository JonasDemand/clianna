import { Badge, Label } from '@mui/icons-material';
import {
  Alert,
  AlertColor,
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Snackbar,
  Typography,
} from '@mui/material';
import { Customer } from '@prisma/client';
import {
  FormEventHandler,
  FunctionComponent,
  MouseEventHandler,
  useContext,
  useState,
} from 'react';
import { CustomerContextType } from '../../../@types/customer';
import { CustomerContext } from '../../../context/customerContext';
import CustomerAdress from './CustomerAdress';
import CustomerBasedata from './CustomerBasedata';

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
    const { oders: _, openOrders: __, ...body } = selected;
    setSelectedDisabled(true);
    const res = await fetch(`/api/customers/${selected.id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      alert('error!!');
      return;
    }
    const newCust = (await res.json()) as Customer;
    let newCustomers = [...customers];
    const index = newCustomers.findIndex(
      (customer) => customer.id === newCust.id
    );
    newCustomers[index] = { ...newCustomers[index], ...newCust };
    setCustomers(newCustomers);
    setAlertOpen(true);
    setAlertMessage(`Erfolgreich Kunde ${selected.id} aktualisiert`);
    setAlertSeverity('success');
  };
  const onEnable: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setSelectedDisabled(false);
  };
  const onClose: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setSelectedDisabled(true);
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
            <Typography>Kunde {selected?.id}</Typography>
            <CustomerBasedata />
            <CustomerAdress />{' '}
          </>
        ) : (
          <Box sx={{ width: 1, height: 1 }} display="flex">
            <Box m="auto">
              <Typography fontSize="large">Kein Kunde ausgewählt</Typography>
              <Badge sx={{ width: 1 }} fontSize="large" color="primary" />
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

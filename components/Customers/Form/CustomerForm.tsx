import { CustomerContext } from '@context/CustomerContext';
import { CustomerContextType } from '@customTypes/database/customer';
import { Badge } from '@mui/icons-material';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  Typography,
} from '@mui/material';
import { concertToCustomer } from '@utils/api/customers';
import {
  createCustomer,
  revalidate,
  updateCustomer,
} from '@utils/api/requests/customers';
import { isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import {
  FC,
  FormEventHandler,
  MouseEventHandler,
  useContext,
  useState,
} from 'react';

import CustomerAdress from './CustomerAdress';
import CustomerBasedata from './CustomerBasedata';
import CustomerFormHeader from './CustomerFormHeader';

const CustomerForm: FC = () => {
  const {
    customers,
    setCustomers,
    selected,
    setSelected,
    selectedDisabled,
    setSelectedDisabled,
  } = useContext(CustomerContext) as CustomerContextType;
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!selected) return;
    if (
      isEqual(
        selected,
        customers.find((customer) => customer.id === selected.id)
      )
    ) {
      enqueueSnackbar('Keine Daten zum Speichern', {
        variant: 'info',
      });
      return;
    }
    let create = selected.id === -1;
    let newCustomers = [...customers];
    let newCust = selected;
    try {
      setLoading(true);
      setSelectedDisabled(true);
      if (create) {
        newCust = await createCustomer(concertToCustomer(selected));
        newCustomers.push(newCust);
        newCustomers = newCustomers.sort((a, b) =>
          a.lastname.toLowerCase().localeCompare(b.lastname.toLowerCase())
        );
      } else {
        newCust = await updateCustomer(
          selected.id,
          concertToCustomer(selected)
        );
        const index = newCustomers.findIndex(
          (customer) => customer.id === newCust.id
        );
        newCustomers[index] = newCust;
      }
      setSelected(newCust);
      setCustomers(newCustomers);
      enqueueSnackbar(
        `Erfolgreich Kunde ${newCust.id} ${
          create ? 'erstellt' : 'aktualisiert'
        }`,
        { variant: 'success' }
      );
    } catch {
      enqueueSnackbar(
        `${create ? 'Erstellen' : 'Aktualisieren'} von Kunde ${newCust.id}
          fehlgeschlagen`,
        { variant: 'error' }
      );
      return;
    }
    setLoading(false);

    enqueueSnackbar('Neuladen von Kunden gestartet', {
      variant: 'info',
    });
    try {
      await revalidate();
    } catch {
      enqueueSnackbar('Neuladen von Kunden fehlgeschlagen', {
        variant: 'warning',
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
    <>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress size={100} />
      </Backdrop>
      <FormControl
        sx={{ width: 1, height: 1, p: 1, display: 'flex', overflow: 'scroll' }}
        component="form"
        onSubmit={onSubmit}
      >
        <Box sx={{ flex: '1 1 auto' }}>
          {selected ? (
            <Grid
              sx={{
                width: 1,
                height: 1,
                margin: 0,
                '& > .MuiGrid-item': {
                  padding: 0,
                },
              }}
              container
              spacing={2}
              direction="column"
            >
              <Grid item>
                <CustomerFormHeader />
              </Grid>
              <Grid sx={{ mt: 2 }} item>
                <CustomerBasedata />
              </Grid>
              <Grid sx={{ mt: 2 }} item>
                <CustomerAdress />
              </Grid>
            </Grid>
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
              <Button
                sx={{ mr: 1 }}
                fullWidth
                type="submit"
                variant="contained"
              >
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
      </FormControl>
    </>
  );
};

export default CustomerForm;

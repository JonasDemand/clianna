import { CustomerContext } from '@context/CustomerContext';
import { CustomerContextType } from '@customTypes/customer';
import { Backdrop, Button, CircularProgress, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { concertToCustomer } from '@utils/api/customers';
import {
  createCustomer,
  revalidate,
  updateCustomer,
} from '@utils/api/requests/customers';
import { isEqual } from 'lodash';
import { useSnackbar } from 'notistack';
import { FC, useContext, useState } from 'react';

import CustomerAdress from './CustomerAdress';
import CustomerBasedata from './CustomerBasedata';
import CustomerFormHeader from './CustomerFormHeader';

const CustomerForm: FC = () => {
  const { customers, setCustomers, selected, setSelected } = useContext(
    CustomerContext
  ) as CustomerContextType;
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const saveCustomer = async () => {
    if (!selected) return;
    if (
      isEqual(
        selected,
        customers.find((customer) => customer.id === selected.id)
      )
    ) {
      enqueueSnackbar('Keine Daten zum Speichern vorhanden', {
        variant: 'info',
      });
      return;
    }
    let create = selected.id === -1;
    let newCustomers = [...customers];
    let newCust = selected;
    try {
      setLoading(true);
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
      setSelected(null);
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

  return (
    <>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress size={100} />
      </Backdrop>
      <Box sx={{ width: { xs: 1, md: 'calc(100vw/2)' }, p: 1 }}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <CustomerFormHeader />
          </Grid>
          <Grid item>
            <CustomerBasedata />
          </Grid>
          <Grid item>
            <CustomerAdress />
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Button fullWidth variant="contained" onClick={saveCustomer}>
              Speichern
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="warning"
              onClick={() => setSelected(null)}
            >
              Abbrechen
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default CustomerForm;

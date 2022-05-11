import { Box, Button, FormControl, Typography } from '@mui/material';
import { Customer } from '@prisma/client';
import {
  FormEventHandler,
  FunctionComponent,
  MouseEventHandler,
  useContext,
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

  return (
    <FormControl
      sx={{ width: 1, height: 1, display: 'flex' }}
      component="form"
      onSubmit={onSubmit}
    >
      <Box sx={{ flex: '1 1 auto' }}>
        <Typography>Kunde {selected?.id}</Typography>
        <CustomerBasedata />
        <CustomerAdress />
      </Box>
      <Box sx={{ display: 'flex' }}>
        {selectedDisabled ? (
          <Button
            sx={{ mt: 2 }}
            fullWidth
            color="secondary"
            variant="contained"
            onClick={onEnable}
          >
            Bearbeiten
          </Button>
        ) : (
          <Button
            sx={{ mt: 2, mr: 1 }}
            fullWidth
            type="submit"
            variant="contained"
          >
            Speichern
          </Button>
        )}
        <Button
          sx={{ mt: 2, ml: 1 }}
          color="error"
          fullWidth
          variant="contained"
          onClick={onClose}
        >
          Schließen
        </Button>
      </Box>
    </FormControl>
  );
};

export default CustomerForm;

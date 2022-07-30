import { columns } from '@consts/customers';
import { CustomerContext } from '@context/CustomerContext';
import {
  CustomerContextType,
  ICustomerWithOrders,
  ShowCustomers,
} from '@customTypes/database/customer';
import {
  Autocomplete,
  Button,
  Divider,
  Grid,
  MenuItem,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import { Order } from '@prisma/client';
import React, { ChangeEvent, FC, SyntheticEvent, useContext } from 'react';

const defaultCustomer = (): ICustomerWithOrders => ({
  id: 0,
  firstname: '',
  lastname: '',
  email: null,
  street: null,
  streetnumber: null,
  city: null,
  postalcode: null,
  phone: null,
  shoesize: null,
  disabled: false,
  orders: new Array<Order>(),
  openOrders: 0,
});

const CustomersTableHeader: FC = () => {
  const {
    searchText,
    showCustomers,
    activeColumns,
    setSelected,
    setSearchText,
    setActiveColumns,
    setShowCustomers,
    setSelectedDisabled,
  } = useContext(CustomerContext) as CustomerContextType;

  const changeSearchText = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.target.value);

  const changeActiveColumns = (
    _: SyntheticEvent<Element, Event>,
    value: (string | undefined)[]
  ) => setActiveColumns(value);
  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={1} alignItems="center" justifyContent="center">
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="search"
            label="Suche"
            value={searchText}
            onChange={changeSearchText}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            multiple
            options={columns.map((column) => column.headerName)}
            value={activeColumns}
            onChange={changeActiveColumns}
            limitTags={1}
            renderInput={(params) => <TextField {...params} label="Spalten" />}
          />
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Grid
        container
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            value={showCustomers}
            onChange={(e) =>
              setShowCustomers(parseInt(e.target.value, 10) as ShowCustomers)
            }
            select
            label="Anzeige"
          >
            <MenuItem value={ShowCustomers.All}>Alle</MenuItem>
            <MenuItem value={ShowCustomers.Active}>Aktiviert</MenuItem>
            <MenuItem value={ShowCustomers.Disabled}>Deaktivierte</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              setSelected(defaultCustomer());
              setSelectedDisabled(false);
            }}
          >
            Hinzufügen
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomersTableHeader;

import { columns, defaultCustomer, ShowCustomerLabel } from '@consts/customer';
import { CustomerContext } from '@context/CustomerContext';
import { CustomerContextType, EShowCustomer } from '@customTypes/customer';
import { ICustomerWithOrders } from '@customTypes/database/customer';
import { Add, Search } from '@mui/icons-material';
import { Autocomplete, Button, Divider, Grid, TextField } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React, {
  ChangeEvent,
  FC,
  memo,
  SyntheticEvent,
  useContext,
} from 'react';

import EnumSelect from '../Inputs/EnumSelect';

const CustomersTableHeader: FC = () => {
  const {
    searchText,
    showCustomers,
    activeColumns,
    setSelected,
    setSearchText,
    setActiveColumns,
    setShowCustomers,
  } = useContext(CustomerContext) as CustomerContextType;

  const changeSearchText = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.target.value);

  const changeActiveColumns = (
    _: SyntheticEvent<Element, Event>,
    value: GridColDef<ICustomerWithOrders>[]
  ) => setActiveColumns(value);
  return (
    <>
      <Grid container spacing={1} alignItems="center" justifyContent="center">
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="text"
            label="Suche"
            value={searchText}
            onChange={changeSearchText}
            InputProps={{
              endAdornment: <Search />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete<GridColDef<ICustomerWithOrders>, true>
            multiple
            options={columns}
            value={activeColumns}
            onChange={changeActiveColumns}
            limitTags={2}
            getOptionLabel={(option) => option.headerName ?? ''}
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
          <EnumSelect
            label="Status"
            value={showCustomers}
            enumToUse={EShowCustomer}
            enumLabel={ShowCustomerLabel}
            onChange={setShowCustomers}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            startIcon={<Add />}
            onClick={() => {
              setSelected(defaultCustomer());
            }}
          >
            Hinzufügen
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default memo(CustomersTableHeader);

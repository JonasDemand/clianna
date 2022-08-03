import { columns, defaultOrder } from '@consts/order';
import { OrderContext } from '@context/OrderContext';
import { IOrderWithCustomer } from '@customTypes/database/order';
import { OrderContextType, ShowOrders } from '@customTypes/order';
import { Add, Search } from '@mui/icons-material';
import {
  Autocomplete,
  Button,
  Divider,
  Grid,
  MenuItem,
  TextField,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React, {
  ChangeEvent,
  FC,
  memo,
  SyntheticEvent,
  useContext,
} from 'react';

const OrdersTableHeader: FC = () => {
  const {
    searchText,
    showOrders,
    activeColumns,
    setSelected,
    setSearchText,
    setActiveColumns,
    setShowOrders,
  } = useContext(OrderContext) as OrderContextType;

  const changeSearchText = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.target.value);

  const changeActiveColumns = (
    _: SyntheticEvent<Element, Event>,
    value: GridColDef<IOrderWithCustomer>[]
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
          <Autocomplete<GridColDef<IOrderWithCustomer>, true>
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
          <TextField
            fullWidth
            value={showOrders}
            select
            label="Status"
            onChange={(e) =>
              setShowOrders(parseInt(e.target.value, 10) as ShowOrders)
            }
          >
            <MenuItem value={ShowOrders.All}>Alle</MenuItem>
            <MenuItem value={ShowOrders.Pending}>Ausstehend</MenuItem>
            <MenuItem value={ShowOrders.Done}>Erledigt</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            startIcon={<Add />}
            onClick={() => {
              setSelected(defaultOrder());
            }}
          >
            Hinzufügen
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default memo(OrdersTableHeader);

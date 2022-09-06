import EnumSelect from '@components/Form/EnumSelect';
import { defaultOrder, ShowOrderLabels, variableColumns } from '@consts/order';
import { OrderContext } from '@context/OrderContext';
import { IOrderWithCustomer } from '@customTypes/database/order';
import { EShowOrder, OrderContextType } from '@customTypes/order';
import { Add, Search } from '@mui/icons-material';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Button,
  Divider,
  Grid,
  TextField,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React, { ChangeEvent, FC, useCallback, useContext } from 'react';

const OrdersTableHeader: FC = () => {
  const {
    searchText,
    showOrders,
    activeVariableColumns,
    setSelected,
    setSearchText,
    setActiveVariableColumns,
    setShowOrders,
  } = useContext(OrderContext) as OrderContextType;

  const onChangeSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value),
    [setSearchText]
  );
  const onChangeColumns = useCallback(
    (_: unknown, value: GridColDef<IOrderWithCustomer>[]) =>
      setActiveVariableColumns(value),
    [setActiveVariableColumns]
  );

  const onClickAdd = useCallback(
    () => setSelected(defaultOrder()),
    [setSelected]
  );

  const getOptionLabelColumns = useCallback(
    (option: GridColDef<IOrderWithCustomer>) => option.headerName ?? '',
    []
  );

  const renderInputColumns = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <TextField {...params} label="Spalten" />
    ),
    []
  );

  return (
    <>
      <Grid container spacing={1} alignItems="center" justifyContent="center">
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="text"
            label="Suche"
            value={searchText}
            onChange={onChangeSearch}
            InputProps={{
              endAdornment: <Search />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete<GridColDef<IOrderWithCustomer>, true>
            openOnFocus
            multiple
            options={variableColumns}
            value={activeVariableColumns}
            onChange={onChangeColumns}
            limitTags={2}
            getOptionLabel={getOptionLabelColumns}
            renderInput={renderInputColumns}
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
            value={showOrders}
            enumToUse={EShowOrder}
            enumLabel={ShowOrderLabels}
            onChange={setShowOrders}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            startIcon={<Add />}
            onClick={onClickAdd}
          >
            Hinzufügen
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default OrdersTableHeader;

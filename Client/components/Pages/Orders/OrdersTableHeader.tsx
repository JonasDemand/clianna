import MuiButton from '@components/External/MuiButton';
import MuiTextField from '@components/External/MuiTextField';
import EnumSelect from '@components/Form/EnumSelect';
import { defaultOrder, ShowOrderLabels, variableColumns } from '@consts/order';
import { useOrderContext } from '@context/OrderContext';
import { usePaginationContext } from '@context/PaginationContext';
import { EShowOrder } from '@customTypes/order';
import { Add, Search } from '@mui/icons-material';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { Order } from '@utils/api/generated/Api';
import { getCustomerLabel } from '@utils/customer';
import React, { ChangeEvent, FC, useCallback } from 'react';

const OrdersTableHeader: FC = () => {
  const {
    showOrders,
    activeVariableColumns,
    setSelected,
    setActiveVariableColumns,
    setShowOrders,
    customers,
    filterCustomer,
    setFilterCustomer,
  } = useOrderContext();
  const { setSearchText } = usePaginationContext();

  const onChangeSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value),
    [setSearchText]
  );
  const onChangeColumns = useCallback(
    (_: unknown, value: GridColDef<Order>[]) => setActiveVariableColumns(value),
    [setActiveVariableColumns]
  );

  const onClickAdd = useCallback(
    () => setSelected(defaultOrder()),
    [setSelected]
  );

  const getOptionLabelColumns = useCallback(
    (option: GridColDef<Order>) => option.headerName ?? '',
    []
  );

  const renderInputColumns = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <MuiTextField {...params} label="Spalten" />
    ),
    []
  );

  const renderInputCustomer = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <MuiTextField {...params} variant="outlined" label="Kunde" />
    ),
    []
  );

  return (
    <>
      <Grid container spacing={1} alignItems="center" justifyContent="center">
        <Grid item xs={12} md={6}>
          <MuiTextField
            fullWidth
            type="text"
            label="Suche"
            onChange={onChangeSearch}
            InputProps={{
              endAdornment: <Search />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete<GridColDef<Order>, true>
            openOnFocus
            multiple
            options={variableColumns}
            value={activeVariableColumns}
            onChange={onChangeColumns}
            limitTags={2}
            getOptionLabel={getOptionLabelColumns}
            renderInput={renderInputColumns}
            renderOption={(props, option) => (
              <li {...props} key={option.field}>
                {getOptionLabelColumns(option)}
              </li>
            )}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.field}
                  label={getOptionLabelColumns(option)}
                />
              ))
            }
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
        <Grid item xs={12} md={6}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <EnumSelect
                label="Status"
                value={showOrders}
                enumToUse={EShowOrder}
                enumLabel={ShowOrderLabels}
                onChange={setShowOrders}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                openOnFocus
                options={customers}
                value={filterCustomer}
                onChange={(_, value) => setFilterCustomer(value)}
                getOptionLabel={getCustomerLabel}
                renderInput={renderInputCustomer}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {getCustomerLabel(option)}
                  </li>
                )}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={2}>
          <MuiButton
            variant="contained"
            color="success"
            fullWidth
            startIcon={<Add />}
            onClick={onClickAdd}
          >
            Hinzufügen
          </MuiButton>
        </Grid>
      </Grid>
    </>
  );
};

export default OrdersTableHeader;

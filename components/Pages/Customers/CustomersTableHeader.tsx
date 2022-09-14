import MuiButton from '@components/External/MuiButton';
import MuiTextField from '@components/External/MuiTextField';
import {
  defaultCustomer,
  ShowCustomerLabels,
  variableColumns,
} from '@consts/customer';
import { CustomerContext } from '@context/CustomerContext';
import { CustomerContextType, EShowCustomer } from '@customTypes/customer';
import { ICustomerWithDependencies } from '@customTypes/database/customer';
import { Add, Search } from '@mui/icons-material';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Divider,
  Grid,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React, { ChangeEvent, FC, useCallback, useContext } from 'react';

import EnumSelect from '../../Form/EnumSelect';

const CustomersTableHeader: FC = () => {
  const {
    searchText,
    showCustomers,
    activeVariableColumns,
    setSelected,
    setSearchText,
    setActiveVariableColumns,
    setShowCustomers,
  } = useContext(CustomerContext) as CustomerContextType;

  const onChangeSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value),
    [setSearchText]
  );
  const onChangeColumns = useCallback(
    (_: unknown, value: GridColDef<ICustomerWithDependencies>[]) =>
      setActiveVariableColumns(value),
    [setActiveVariableColumns]
  );

  const onClickAdd = useCallback(
    () => setSelected(defaultCustomer()),
    [setSelected]
  );

  const getOptionLabelColumns = useCallback(
    (option: GridColDef<ICustomerWithDependencies>) => option.headerName ?? '',
    []
  );

  const renderInputColumns = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <MuiTextField {...params} label="Spalten" />
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
            value={searchText}
            onChange={onChangeSearch}
            InputProps={{
              endAdornment: <Search />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete<GridColDef<ICustomerWithDependencies>, true>
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
            value={showCustomers}
            enumToUse={EShowCustomer}
            enumLabel={ShowCustomerLabels}
            onChange={setShowCustomers}
          />
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

export default CustomersTableHeader;

import MuiButton from '@components/External/MuiButton';
import MuiTextField from '@components/External/MuiTextField';
import {
  defaultCustomer,
  ShowCustomerLabels,
  variableColumns,
} from '@consts/customer';
import { useCustomerContext } from '@context/CustomerContext';
import { EShowCustomer } from '@customTypes/customer';
import { Add, Search } from '@mui/icons-material';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { Customer } from '@utils/api/generated/Api';
import { debounce } from 'lodash';
import React, { ChangeEvent, FC, useCallback } from 'react';

import EnumSelect from '../../Form/EnumSelect';

const CustomersTableHeader: FC = () => {
  const {
    showCustomers,
    activeVariableColumns,
    setSelected,
    setSearchText,
    setActiveVariableColumns,
    setShowCustomers,
  } = useCustomerContext();

  const onChangeSearch = useCallback(
    debounce(
      (e: ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value),
      500
    ),
    [setSearchText]
  );
  const onChangeColumns = useCallback(
    (_: unknown, value: GridColDef<Customer>[]) =>
      setActiveVariableColumns(value),
    [setActiveVariableColumns]
  );

  const onClickAdd = useCallback(
    () => setSelected(defaultCustomer()),
    [setSelected]
  );

  const getOptionLabelColumns = useCallback(
    (option: GridColDef<Customer>) => option.headerName ?? '',
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
            onChange={onChangeSearch}
            InputProps={{
              endAdornment: <Search />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete<GridColDef<Customer>, true>
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

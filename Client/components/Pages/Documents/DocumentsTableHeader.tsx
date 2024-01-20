import MuiButton from '@components/External/MuiButton';
import MuiTextField from '@components/External/MuiTextField';
import EnumSelect from '@components/Form/EnumSelect';
import { ShowDocumentLabels } from '@consts/document';
import { variableColumns } from '@consts/document';
import { useDocumentContext } from '@context/DocumentContext';
import { usePaginationContext } from '@context/PaginationContext';
import { EId } from '@customTypes/id';
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
import { Customer, Order } from '@utils/api/generated/Api';
import React, { ChangeEvent, FC, useCallback } from 'react';

import ReferenceInput from './common/ReferenceInput';

const DocumentsTableHeader: FC = () => {
  const {
    showDocuments,
    setShowDocuments,
    activeVariableColumns,
    setSelected,
    setActiveVariableColumns,
    filterReference,
    setFilterReference,
  } = useDocumentContext();
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
    () => setSelected({ id: EId.Create }),
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
                label="Typ"
                value={showDocuments}
                enumToUse={EShowOrder}
                enumLabel={ShowDocumentLabels}
                onChange={setShowDocuments}
              />
            </Grid>
            <Grid item xs={6}>
              <ReferenceInput
                variant="outlined"
                value={filterReference}
                onChange={
                  ((_: unknown, value: Customer | Order | null) =>
                    setFilterReference(value)) as any /*TODO: improve typing*/
                }
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

export default DocumentsTableHeader;

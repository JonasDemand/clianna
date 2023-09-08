import MuiButton from '@components/External/MuiButton';
import MuiTextField from '@components/External/MuiTextField';
import EnumSelect from '@components/Form/EnumSelect';
import { ShowDocumentLabels } from '@consts/document';
import { variableColumns } from '@consts/document';
import { DocumentContext } from '@context/DocumentContext';
import { IOrderWithDependencies } from '@customTypes/database/order';
import { DocumentContextType } from '@customTypes/document';
import { EId } from '@customTypes/id';
import { EShowOrder } from '@customTypes/order';
import { Add, Search } from '@mui/icons-material';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Divider,
  Grid,
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { debounce } from 'lodash';
import React, { ChangeEvent, FC, useCallback, useContext } from 'react';

const DocumentsTableHeader: FC = () => {
  const {
    showDocuments,
    setShowDocuments,
    activeVariableColumns,
    setSelected,
    setSearchText,
    setActiveVariableColumns,
  } = useContext(DocumentContext) as DocumentContextType;

  const onChangeSearch = useCallback(
    debounce(
      (e: ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value),
      500
    ),
    [setSearchText]
  );
  const onChangeColumns = useCallback(
    (_: unknown, value: GridColDef<IOrderWithDependencies>[]) =>
      setActiveVariableColumns(value),
    [setActiveVariableColumns]
  );

  const onClickAdd = useCallback(
    () => setSelected({ id: EId.Create }),
    [setSelected]
  );

  const getOptionLabelColumns = useCallback(
    (option: GridColDef<IOrderWithDependencies>) => option.headerName ?? '',
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
          <Autocomplete<GridColDef<IOrderWithDependencies>, true>
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
            label="Typ"
            value={showDocuments}
            enumToUse={EShowOrder}
            enumLabel={ShowDocumentLabels}
            onChange={setShowDocuments}
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

export default DocumentsTableHeader;

import MuiTextField from '@components/External/MuiTextField';
import FormTextField from '@components/Form/FormInput';
import FormSection from '@components/Form/FormSection';
import { DocumentContext } from '@context/DocumentContext';
import { ICustomer } from '@customTypes/database/customer';
import { IOrder } from '@customTypes/database/order';
import { DocumentContextType } from '@customTypes/document';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
} from '@mui/material';
import { getCustomerLabel } from '@utils/customer';
import { getOrderLabel } from '@utils/order';
import React, { ChangeEvent, FC, useCallback, useContext } from 'react';

const DocumentGeneral: FC = () => {
  const { selected, updateSelected, customers, orders } = useContext(
    DocumentContext
  ) as DocumentContextType;

  const isCustomer = useCallback(
    (obj?: object | null) => customers.findIndex((x) => x === obj) !== -1,
    [customers]
  );

  const onChangeTemplate = useCallback(
    (_: unknown, checked: boolean) => updateSelected({ template: checked }),
    [updateSelected]
  );
  const onChangeName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected({ name: e.target.value }),
    [updateSelected]
  );
  const onChangeReference = useCallback(
    (_: unknown, value: ICustomer | IOrder | null) => {
      if (isCustomer(value)) {
        updateSelected({ customer: value, order: null });
        return;
      }
      updateSelected({ order: value, customer: null });
    },
    [isCustomer, updateSelected]
  );
  const onChangeIncrementalId = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const regex = /^[0-9\b]+$/;
      if (e.target.value === '' || regex.test(e.target.value)) {
        updateSelected({ incrementalId: parseInt(e.target.value) });
      }
    },
    [updateSelected]
  );

  const renderInputReference = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <MuiTextField {...params} variant="filled" label="Referenz" />
    ),
    []
  );

  return (
    <FormSection label="Allgemein">
      {selected && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={selected.template ?? false} />}
              label="Template"
              onChange={onChangeTemplate}
            />
          </Grid>
          <Grid item xs={6}>
            <FormTextField
              label="Name"
              required
              value={selected.name}
              onChange={onChangeName}
            />
          </Grid>
          <Box width="100%" />
          <Grid item xs={6}>
            <FormTextField
              label="Inkrementelle ID"
              type="number"
              disabled={!selected.template}
              value={selected.incrementalId}
              onChange={onChangeIncrementalId}
              inputProps={{ step: 1 }}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              openOnFocus
              disabled={selected.template}
              options={customers.concat(orders) as (ICustomer | IOrder)[]}
              groupBy={(option) => (isCustomer(option) ? 'Kunden' : 'Aufträge')}
              value={selected.customer ?? selected.order}
              onChange={onChangeReference}
              getOptionLabel={(option) =>
                isCustomer(option)
                  ? getCustomerLabel(option)
                  : getOrderLabel(option)
              }
              renderInput={renderInputReference}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
            />
          </Grid>
        </Grid>
      )}
    </FormSection>
  );
};

export default DocumentGeneral;
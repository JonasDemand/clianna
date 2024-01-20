import MuiTextField from '@components/External/MuiTextField';
import { useDocumentContext } from '@context/DocumentContext';
import {
  Autocomplete,
  AutocompleteProps,
  AutocompleteRenderInputParams,
  ChipTypeMap,
  TextFieldProps,
} from '@mui/material';
import { Customer, Order } from '@utils/api/generated/Api';
import { getCustomerLabel } from '@utils/customer';
import { getOrderLabel } from '@utils/order';
import React, { useCallback } from 'react';

const ReferenceInput = <
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
  ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent'],
>(
  props: Partial<
    AutocompleteProps<
      Order | Customer,
      Multiple,
      DisableClearable,
      FreeSolo,
      ChipComponent
    >
  > & { variant?: TextFieldProps['variant'] } = { variant: 'filled' }
) => {
  const { customers, orders } = useDocumentContext();

  const isCustomer = useCallback(
    (obj?: any | null) => customers.findIndex((x) => x === obj) !== -1,
    [customers]
  );

  const renderInputReference = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <MuiTextField {...params} variant={props.variant} label="Referenz" />
    ),
    [props.variant]
  );

  return (
    <Autocomplete
      {...props}
      openOnFocus
      options={customers.concat(orders) as (Customer | Order)[]}
      groupBy={(option) => (isCustomer(option) ? 'Kunden' : 'Aufträge')}
      getOptionLabel={(option) =>
        isCustomer(option)
          ? getCustomerLabel(option as Customer)
          : getOrderLabel(option as Order)
      }
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      renderInput={renderInputReference}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {isCustomer(option)
            ? getCustomerLabel(option)
            : getOrderLabel(option)}
        </li>
      )}
    />
  );
};

export default ReferenceInput;

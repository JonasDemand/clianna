import MuiTextField from '@components/External/MuiTextField';
import {
  Autocomplete,
  AutocompleteProps,
  AutocompleteRenderInputParams,
  ChipTypeMap,
  TextFieldProps,
} from '@mui/material';
import { Customer, Order } from '@utils/api/generated/Api';
import { getCustomerLabel, isCustomer } from '@utils/customer';
import { getOrderLabel } from '@utils/order';
import React, { useCallback, useMemo } from 'react';

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
  > & {
    variant?: TextFieldProps['variant'];
    customers: Customer[];
    orders: Order[];
  } = { variant: 'filled', customers: [], orders: [] }
) => {
  const { customers, orders } = props;

  const renderInputReference = useCallback(
    (params: AutocompleteRenderInputParams) => (
      <MuiTextField {...params} variant={props.variant} label="Referenz" />
    ),
    [props.variant]
  );

  const options = useMemo(() => orders.concat(customers), [customers, orders]);

  return (
    <Autocomplete
      {...props}
      openOnFocus
      options={options}
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

import {
  Autocomplete,
  MenuItem,
  TextField,
  TextFieldProps,
} from '@mui/material';
import React from 'react';
import { $enum } from 'ts-enum-util';

export type EnumSelectProps<T> = {
  autocomplete?: boolean;
  freeSolo?: boolean;
  value?: T | '';
  inputValue?: T | '';
  label: string;
  enumToUse: any; //TODO: Replace with some kind of enum generic
  enumLabel?: Map<T, string>;
  onChange?: (value: T) => void;
  onInputChange?: (value: T) => void;
  aditionalTextFieldProps?: Partial<TextFieldProps>;
};

const EnumSelect = <T = string | number,>({
  autocomplete = false,
  freeSolo = false,
  value,
  inputValue,
  label,
  enumToUse,
  enumLabel,
  onChange,
  onInputChange,
  aditionalTextFieldProps,
}: EnumSelectProps<T>) => {
  return autocomplete ? (
    <Autocomplete
      openOnFocus
      freeSolo={freeSolo}
      options={$enum(enumToUse).getValues()}
      value={value as string}
      inputValue={(inputValue as string) ?? ''}
      onChange={(_, newValue) =>
        onChange &&
        onChange(
          (typeof value === 'number'
            ? parseInt(newValue, 10)
            : newValue) as unknown as T
        )
      }
      onInputChange={(_, newValue) =>
        onInputChange &&
        onInputChange(
          (typeof value === 'number'
            ? parseInt(newValue, 10)
            : newValue) as unknown as T
        )
      }
      getOptionLabel={(value) => enumLabel?.get(value) ?? value}
      renderInput={(params) => (
        <TextField {...params} label={label} {...aditionalTextFieldProps} />
      )}
    />
  ) : (
    <TextField
      fullWidth
      select
      value={value}
      label={label}
      onChange={(e) =>
        onChange &&
        onChange(
          (typeof value === 'number'
            ? parseInt(e.target.value, 10)
            : e.target.value) as unknown as T
        )
      }
      {...aditionalTextFieldProps}
    >
      {$enum(enumToUse).map((itemValue, i) => (
        <MenuItem value={itemValue} key={i}>
          {enumLabel?.get(itemValue) ?? itemValue}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default EnumSelect;

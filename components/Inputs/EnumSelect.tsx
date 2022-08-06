import {
  Autocomplete,
  MenuItem,
  TextField,
  TextFieldProps,
} from '@mui/material';
import React, { FC } from 'react';
import { $enum } from 'ts-enum-util';

export type EnumSelectProps = {
  autocomplete?: boolean;
  value: number | '';
  label: string;
  enumToUse: any; //TODO: Replace with some kind of enum generic
  enumLabel: Map<number, string>;
  onChange: (value: number) => void;
  aditionalTextFieldProps?: Partial<TextFieldProps>;
};

const EnumSelect: FC<EnumSelectProps> = ({
  autocomplete = false,
  value,
  label,
  enumToUse,
  enumLabel,
  onChange,
  aditionalTextFieldProps,
}) => {
  return autocomplete ? (
    <Autocomplete
      options={$enum(enumToUse).getValues()}
      value={value}
      onChange={(_, value) => onChange(value)}
      getOptionLabel={(option) => enumLabel.get(option) ?? ''}
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
      onChange={(e) => onChange(parseInt(e.target.value, 10))}
      {...aditionalTextFieldProps}
    >
      {$enum(enumToUse).map((value, i) => (
        <MenuItem value={value} key={i}>
          {enumLabel.get(value)}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default EnumSelect;

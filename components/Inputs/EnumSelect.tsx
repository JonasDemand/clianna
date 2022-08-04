import {
  Autocomplete,
  MenuItem,
  TextField,
  TextFieldProps,
} from '@mui/material';
import React, { FC } from 'react';
import { $enum } from 'ts-enum-util';

export type EnumSelectProps = {
  variant?: TextFieldProps['variant'];
  autocomplete?: boolean;
  value: number | null | undefined;
  label: string;
  enumToUse: any; //TODO: Replace with some kind of enum generic
  enumLabel: Map<number, string>;
  onChange: (value: number) => void;
};

const EnumSelect: FC<EnumSelectProps> = ({
  autocomplete = false,
  variant = 'standard',
  value,
  label,
  enumToUse,
  enumLabel,
  onChange,
}) => {
  return autocomplete ? (
    <Autocomplete
      options={$enum(enumToUse).getValues()}
      value={value}
      onChange={(_, value) => onChange(value)}
      getOptionLabel={(option) => enumLabel.get(option) ?? ''}
      renderInput={(params) => (
        <TextField {...params} variant={variant} label={label} />
      )}
    />
  ) : (
    <TextField
      fullWidth
      select
      variant={variant}
      value={value}
      label={label}
      onChange={(e) => onChange(parseInt(e.target.value, 10))}
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

import { MenuItem, TextField } from '@mui/material';
import React, { FC } from 'react';
import { $enum } from 'ts-enum-util';

export type EnumDropdownProps = {
  value: number;
  label: string;
  enumToUse: any; //TODO: Replace with some kind of enum generic
  enumLabel: Map<number, string>;
  onChange: (value: number) => void;
};

const EnumSelect: FC<EnumDropdownProps> = ({
  value,
  label,
  enumToUse,
  enumLabel,
  onChange,
}) => {
  return (
    <TextField
      fullWidth
      value={value}
      select
      label={label}
      onChange={(e) => onChange(parseInt(e.target.value, 10))}
    >
      {$enum(enumToUse).map((state, i) => (
        <MenuItem value={state} key={i}>
          {enumLabel.get(state)}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default EnumSelect;

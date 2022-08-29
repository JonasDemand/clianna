import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import React from 'react';
import { $enum } from 'ts-enum-util';

export type EnumRadioListProps<T> = {
  value: T | '';
  label: string;
  enumToUse: any; //TODO: Replace with some kind of enum generic
  enumLabel: Map<any, string>;
  onChange: (value: T) => void;
};

const EnumRadioList = <T = string | number,>({
  value,
  label,
  enumToUse,
  enumLabel,
  onChange,
}: EnumRadioListProps<T>) => {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <RadioGroup
        value={value}
        onChange={(_, newValue) =>
          onChange(
            (typeof value === 'number'
              ? parseInt(newValue, 10)
              : newValue) as unknown as T
          )
        }
      >
        {$enum(enumToUse).map((value, i) => (
          <FormControlLabel
            value={value}
            control={<Radio />}
            label={enumLabel.get(value)}
            key={i}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default EnumRadioList;

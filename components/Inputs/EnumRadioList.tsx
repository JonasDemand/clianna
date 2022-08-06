import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import React, { FC } from 'react';
import { $enum } from 'ts-enum-util';

export type EnumEnumRadioListProps = {
  value: number | '';
  label: string;
  enumToUse: any; //TODO: Replace with some kind of enum generic
  enumLabel: Map<number, string>;
  onChange: (value: number) => void;
};

const EnumRadioList: FC<EnumEnumRadioListProps> = ({
  value,
  label,
  enumToUse,
  enumLabel,
  onChange,
}) => {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <RadioGroup
        value={value}
        onChange={(_, value) => onChange(parseInt(value, 10))}
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

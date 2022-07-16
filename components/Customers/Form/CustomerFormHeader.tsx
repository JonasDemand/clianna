import {
  Checkbox,
  FormControlLabel,
  FormLabel,
  Typography,
} from '@mui/material';
import { FunctionComponent, useContext } from 'react';

import {
  CustomerContextType,
  ICustomerWithOrders,
} from '../../../@types/database/customer';
import { CustomerContext } from '../../../context/customerContext';

const CustomerFormHeader: FunctionComponent = () => {
  const { selected, setSelected, selectedDisabled } = useContext(
    CustomerContext
  ) as CustomerContextType;

  return (
    <FormLabel>
      <Typography variant="h6">
        {selected?.id === 0 ? 'Neuer Kunde' : `Kunde ${selected?.id}`}
      </Typography>
      <FormControlLabel
        control={
          <Checkbox checked={selected?.disabled} disabled={selectedDisabled} />
        }
        label="Deaktiviert"
        onChange={(e, checked) =>
          setSelected({
            ...(selected as ICustomerWithOrders),
            disabled: checked,
          })
        }
      />
    </FormLabel>
  );
};

export default CustomerFormHeader;

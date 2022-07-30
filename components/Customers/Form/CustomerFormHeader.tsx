import { CustomerContext } from '@context/CustomerContext';
import {
  CustomerContextType,
  ICustomerWithOrders,
} from '@customTypes/database/customer';
import {
  Checkbox,
  FormControlLabel,
  FormLabel,
  Typography,
} from '@mui/material';
import { FC, useContext } from 'react';

const CustomerFormHeader: FC = () => {
  const { selected, setSelected, selectedDisabled } = useContext(
    CustomerContext
  ) as CustomerContextType;

  return (
    <FormLabel>
      <Typography variant="h6">
        {selected?.id === -1 ? 'Neuer Kunde' : `Kunde ${selected?.id}`}
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

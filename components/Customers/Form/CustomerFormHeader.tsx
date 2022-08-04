import { CustomerContext } from '@context/CustomerContext';
import { CustomerContextType } from '@customTypes/customer';
import { ICustomerWithOrders } from '@customTypes/database/customer';
import { Checkbox, FormControlLabel } from '@mui/material';
import { FC, useContext } from 'react';

const CustomerFormHeader: FC = () => {
  const { selected, setSelected } = useContext(
    CustomerContext
  ) as CustomerContextType;

  return (
    <FormControlLabel
      control={<Checkbox checked={selected?.disabled ?? false} />}
      label="Deaktiviert"
      onChange={(_, checked) =>
        setSelected({
          ...(selected as ICustomerWithOrders),
          disabled: checked,
        })
      }
    />
  );
};

export default CustomerFormHeader;

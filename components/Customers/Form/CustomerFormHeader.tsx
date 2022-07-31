import { CustomerContext } from '@context/CustomerContext';
import { CustomerContextType } from '@customTypes/customer';
import { ICustomerWithOrders } from '@customTypes/database/customer';
import { Checkbox, Divider, FormControlLabel, Typography } from '@mui/material';
import { FC, useContext } from 'react';

const CustomerFormHeader: FC = () => {
  const { selected, setSelected } = useContext(
    CustomerContext
  ) as CustomerContextType;

  return (
    <>
      <Typography variant="h6">
        {selected?.id === -1 ? 'Neuer Kunde' : `Kunde ${selected?.id}`}
      </Typography>
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
      <Divider />
    </>
  );
};

export default CustomerFormHeader;

import { FormControlLabel, Checkbox, Typography } from '@mui/material';
import { FunctionComponent, useContext } from 'react';
import {
  CustomerContextType,
  ICustomerWithOrders,
} from '../../../@types/customer';
import { CustomerContext } from '../../../context/customerContext';

const CustoemrDisabled: FunctionComponent = () => {
  const { selected, setSelected, selectedDisabled } = useContext(
    CustomerContext
  ) as CustomerContextType;

  return (
    <>
      <Typography>
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
    </>
  );
};

export default CustoemrDisabled;

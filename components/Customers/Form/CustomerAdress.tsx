import FormInput from '@components/Inputs/FormInput';
import FormSection from '@components/SideOverlay/FormSection';
import { CustomerContext } from '@context/CustomerContext';
import { CustomerContextType } from '@customTypes/customer';
import { ICustomerWithOrders } from '@customTypes/database/customer';
import { Grid } from '@mui/material';
import { FC, useContext } from 'react';

const CustomerAdress: FC = () => {
  const { selected, setSelected } = useContext(
    CustomerContext
  ) as CustomerContextType;
  return (
    <FormSection label="Adresse">
      {selected && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormInput
              label="Straße"
              value={selected.street}
              onChange={(e) =>
                setSelected({
                  ...(selected as ICustomerWithOrders),
                  street: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <FormInput
              label="Hausnummer"
              value={selected.streetnumber}
              onChange={(e) =>
                setSelected({
                  ...(selected as ICustomerWithOrders),
                  streetnumber: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <FormInput
              label="Postleitzahl"
              value={selected.postalcode}
              onChange={(e) =>
                setSelected({
                  ...(selected as ICustomerWithOrders),
                  postalcode: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <FormInput
              label="Stadt"
              value={selected.city}
              onChange={(e) =>
                setSelected({
                  ...(selected as ICustomerWithOrders),
                  city: e.target.value,
                })
              }
            />
          </Grid>
        </Grid>
      )}
    </FormSection>
  );
};

export default CustomerAdress;

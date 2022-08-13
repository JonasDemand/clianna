import FormSection from '@components/SideOverlay/FormSection';
import { CustomerContext } from '@context/CustomerContext';
import { CustomerContextType } from '@customTypes/customer';
import { ICustomerWithOrders } from '@customTypes/database/customer';
import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import { FC, useContext } from 'react';

const CustomerGeneral: FC = () => {
  const { selected, setSelected } = useContext(
    CustomerContext
  ) as CustomerContextType;

  return (
    <FormSection label="Allgemein">
      {selected && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControlLabel
              control={<Checkbox checked={selected.disabled ?? false} />}
              label="Deaktiviert"
              onChange={(_, checked) =>
                setSelected({
                  ...(selected as ICustomerWithOrders),
                  disabled: checked,
                })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={<Checkbox checked={selected.whatsapp ?? false} />}
              label="WhatsApp"
              onChange={(_, checked) =>
                setSelected({
                  ...(selected as ICustomerWithOrders),
                  whatsapp: checked,
                })
              }
            />
          </Grid>
        </Grid>
      )}
    </FormSection>
  );
};

export default CustomerGeneral;

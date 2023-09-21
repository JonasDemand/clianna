import DocumentFormSection from '@components/Form/DocumentFormSection';
import { useOrderContext } from '@context/OrderContext';
import { Grid } from '@mui/material';
import { Document } from '@utils/api/generated/Api';
import React, { FC, useCallback } from 'react';

import OrderDetails from './OrderDetails';
import OrderGeneral from './OrderGeneral';

const OrderFrom: FC = () => {
  const { selected, updateSelected, templates } = useOrderContext();

  const onUpdateDocuments = useCallback(
    (documents: Document[]) => updateSelected('documents', documents),
    [updateSelected]
  );

  return (
    <Grid container direction="column" spacing={2}>
      {selected && (
        <>
          <Grid item>
            <OrderGeneral />
          </Grid>
          <Grid item>
            <OrderDetails />
          </Grid>
          <Grid item>
            <DocumentFormSection
              documents={selected.documents ?? []}
              templates={templates}
              onUpdate={onUpdateDocuments}
              reference={{ order: selected.id }}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default OrderFrom;

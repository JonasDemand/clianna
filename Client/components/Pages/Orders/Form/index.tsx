import DocumentFormSection from '@components/Form/DocumentFormSection';
import { OrderContext } from '@context/OrderContext';
import { IDocument } from '@customTypes/database/document';
import { OrderContextType } from '@customTypes/order';
import { Grid } from '@mui/material';
import React, { FC, useCallback, useContext } from 'react';

import OrderDetails from './OrderDetails';
import OrderGeneral from './OrderGeneral';

const OrderFrom: FC = () => {
  const { selected, updateSelected, templates } = useContext(
    OrderContext
  ) as OrderContextType;

  const onUpdateDocuments = useCallback(
    (documents: IDocument[]) => updateSelected('documents', documents),
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
import DocumentFormSection from '@components/Form/DocumentFormSection';
import { CustomerContext } from '@context/CustomerContext';
import { CustomerContextType } from '@customTypes/customer';
import { IDocument } from '@customTypes/database/document';
import { Grid } from '@mui/material';
import React, { FC, useCallback, useContext } from 'react';

import CustomerAdress from './CustomerAdress';
import CustomerBasedata from './CustomerBasedata';
import CustomerGeneral from './CustomerGeneral';

const CustomerForm: FC = () => {
  const { selected, updateSelected, templates } = useContext(
    CustomerContext
  ) as CustomerContextType;
  const onUpdateDocuments = useCallback(
    (documents: IDocument[]) => updateSelected('documents', documents),
    [updateSelected]
  );

  return (
    <Grid container direction="column" spacing={2}>
      {selected && (
        <>
          <Grid item>
            <CustomerGeneral />
          </Grid>
          <Grid item>
            <CustomerBasedata />
          </Grid>
          <Grid item>
            <CustomerAdress />
          </Grid>
          <Grid item>
            <DocumentFormSection
              documents={selected.documents ?? []}
              templates={templates}
              onUpdate={onUpdateDocuments}
              reference={{ customer: selected.id }}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default CustomerForm;

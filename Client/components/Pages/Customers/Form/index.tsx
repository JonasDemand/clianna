import DocumentFormSection from '@components/Form/DocumentFormSection';
import { useCustomerContext } from '@context/CustomerContext';
import { Grid } from '@mui/material';
import { Document } from '@utils/api/generated/Api';
import React, { FC, useCallback, useMemo } from 'react';

import CustomerAdress from './CustomerAdress';
import CustomerBasedata from './CustomerBasedata';
import CustomerGeneral from './CustomerGeneral';

const CustomerForm: FC = () => {
  const { selected, updateSelected, templates } = useCustomerContext();

  const documents = useMemo(
    () =>
      (selected?.documents ?? []).concat(
        selected?.orders?.flatMap<Document>((x) => x.documents ?? []) ?? []
      ),
    [selected?.documents, selected?.orders]
  );
  const onUpdateDocuments = useCallback(
    (documents: Document[]) => updateSelected('documents', documents),
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
              documents={documents ?? []}
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

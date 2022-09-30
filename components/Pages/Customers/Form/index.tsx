import DocumentForm from '@components/Form/DocumentForm';
import { CustomerContext } from '@context/CustomerContext';
import { CustomerContextType } from '@customTypes/customer';
import { IDocument } from '@customTypes/database/document';
import { Grid } from '@mui/material';
import { FC, useCallback, useContext } from 'react';

import CustomerAdress from './CustomerAdress';
import CustomerBasedata from './CustomerBasedata';
import CustomerGeneral from './CustomerGeneral';

const CustomerForm: FC = () => {
  const { selected, updateSelected } = useContext(
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
            <DocumentForm
              documents={selected.documents}
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

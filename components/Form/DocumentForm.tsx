import MuiTable from '@components/External/MuiTable';
import { columns } from '@consts/document';
import { IDocument } from '@customTypes/database/document';
import { Box, Typography } from '@mui/material';
import React, { FC } from 'react';

import FormSection from './FormSection';

type DocumentFormProps = {
  documents: IDocument[];
};

const DocumentForm: FC<DocumentFormProps> = ({ documents }) => {
  return (
    <FormSection label="Dokumente">
      <Box sx={{ height: '500px' }}>
        <MuiTable
          header={<Typography>Header!!</Typography>}
          searchText=""
          columns={columns}
          rows={documents}
        ></MuiTable>
      </Box>
    </FormSection>
  );
};

export default DocumentForm;

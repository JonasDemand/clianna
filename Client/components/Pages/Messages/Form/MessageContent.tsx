import FormTextField from '@components/Form/FormInput';
import FormSection from '@components/Form/FormSection';
import { useMessageContext } from '@context/MessageContext';
import { Grid } from '@mui/material';
import React, { ChangeEvent, FC, useCallback } from 'react';

const MessageContent: FC = () => {
  const { selected, updateSelected } = useMessageContext();

  const onChangeSubject = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected({ subject: e.target.value }),
    [updateSelected]
  );

  const onChangeBody = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected({ body: e.target.value }),
    [updateSelected]
  );

  return (
    <FormSection label="Inhalt">
      {selected && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormTextField
              label="Betreff"
              required
              value={selected.subject}
              onChange={onChangeSubject}
            />
          </Grid>
          <Grid item xs={12}>
            <FormTextField
              multiline
              required
              variant="filled"
              label="Nachrichtentext"
              value={selected.body ?? ''}
              onChange={onChangeBody}
            />
          </Grid>
        </Grid>
      )}
    </FormSection>
  );
};

export default MessageContent;

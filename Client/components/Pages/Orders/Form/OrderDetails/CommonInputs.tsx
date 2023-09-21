import FormTextField from '@components/Form/FormInput';
import { useOrderContext } from '@context/OrderContext';
import dayjs from 'dayjs';
import React, { ChangeEvent, FC, useCallback } from 'react';

export const DuedatePicker: FC = () => {
  const { selected, updateSelected } = useOrderContext();

  const onChangeDuedate = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected(
        'dueDate',
        e.target.value ? new Date(e.target.value) : undefined
      ),
    [updateSelected]
  );

  return (
    <>
      {selected && (
        <FormTextField
          label="Fertigstellungsdatum"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={
            selected.dueDate && dayjs(selected.dueDate).format('YYYY-MM-DD')
          }
          onChange={onChangeDuedate}
        />
      )}
    </>
  );
};

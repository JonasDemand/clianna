import FormTextField from '@components/Form/FormInput';
import { OrderContext } from '@context/OrderContext';
import { OrderContextType } from '@customTypes/order';
import dayjs from 'dayjs';
import React, { ChangeEvent, FC, useCallback, useContext } from 'react';

export const DuedatePicker: FC = () => {
  const { selected, updateSelected } = useContext(
    OrderContext
  ) as OrderContextType;

  const onChangeDuedate = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected(
        'dueDate',
        e.target.value ? new Date(e.target.value) : null
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

import EnumSelect from '@components/Form/EnumSelect';
import FormTextField from '@components/Form/FormInput';
import { OrderSpecificationLabels } from '@consts/order';
import { OrderContext } from '@context/OrderContext';
import { OrderContextType } from '@customTypes/order';
import { EOrderSpecification } from '@prisma/client';
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

export const SpecificationSelect: FC = () => {
  const { selected, updateSelected } = useContext(
    OrderContext
  ) as OrderContextType;

  const onChangeSpecification = useCallback(
    (value: EOrderSpecification) => updateSelected('specification', value),
    [updateSelected]
  );

  return (
    <>
      {selected && (
        <EnumSelect
          label="Spezifikation"
          enumToUse={EOrderSpecification}
          enumLabel={OrderSpecificationLabels}
          value={selected.specification ?? ''}
          aditionalTextFieldProps={{
            variant: 'filled',
          }}
          onChange={onChangeSpecification}
        />
      )}
    </>
  );
};

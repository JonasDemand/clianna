import EnumSelect from '@components/Inputs/EnumSelect';
import FormInput from '@components/Inputs/FormInput';
import { OrderSpecificationLabels } from '@consts/order';
import { OrderContext } from '@context/OrderContext';
import { IOrderWithCustomer } from '@customTypes/database/order';
import { OrderContextType } from '@customTypes/order';
import { EOrderSpecification } from '@prisma/client';
import dayjs from 'dayjs';
import { FC, useContext } from 'react';

export const DuedatePicker: FC = () => {
  const { selected, setSelected } = useContext(
    OrderContext
  ) as OrderContextType;
  return (
    <>
      {selected && (
        <FormInput
          label="Fertigstellungsdatum"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={
            selected.dueDate && dayjs(selected.dueDate).format('YYYY-MM-DD')
          }
          onChange={(e) =>
            setSelected({
              ...(selected as IOrderWithCustomer),
              dueDate: e.target.value ? new Date(e.target.value) : null,
            })
          }
        />
      )}
    </>
  );
};

export const SpecificationSelect: FC = () => {
  const { selected, setSelected } = useContext(
    OrderContext
  ) as OrderContextType;
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
          onChange={(value) =>
            setSelected({
              ...(selected as IOrderWithCustomer),
              specification: value,
            })
          }
        />
      )}
    </>
  );
};

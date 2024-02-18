import EnumSelect from '@components/Form/EnumSelect';
import FormTextField from '@components/Form/FormInput';
import FormSection from '@components/Form/FormSection';
import ReferenceInput from '@components/Form/ReferenceInput';
import { TemplateTypeLabels } from '@consts/template';
import { useMessageContext } from '@context/MessageContext';
import { Grid } from '@mui/material';
import { Customer, ETemplateType, Order } from '@utils/api/generated/Api';
import { isCustomer } from '@utils/customer';
import React, { ChangeEvent, FC, useCallback } from 'react';

const MessageGeneral: FC = () => {
  const { selected, updateSelected, customers, orders } = useMessageContext();

  const onChangeTemplate = useCallback(
    (value: ETemplateType) => updateSelected({ template: value }),
    [updateSelected]
  );
  const onChangeName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected({ name: e.target.value }),
    [updateSelected]
  );
  const onChangeReference = useCallback(
    (_: unknown, value: Customer | Order | null) => {
      if (isCustomer(value)) {
        updateSelected({ customer: value ?? undefined, order: undefined });
        return;
      }
      updateSelected({ order: value ?? undefined, customer: undefined });
    },
    [updateSelected]
  );

  return (
    <FormSection label="Allgemein">
      {selected && (
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormTextField
              label="Name"
              required
              value={selected.name}
              onChange={onChangeName}
            />
          </Grid>
          <Grid item xs={6}>
            <EnumSelect
              label="Typ"
              aditionalTextFieldProps={{
                variant: 'filled',
              }}
              value={selected.template}
              enumToUse={ETemplateType}
              enumLabel={TemplateTypeLabels}
              onChange={onChangeTemplate}
            />
          </Grid>
          <Grid item xs={6}>
            <ReferenceInput
              variant="filled"
              customers={customers}
              orders={orders}
              disabled={selected.template !== ETemplateType.None}
              value={selected.customer ?? selected.order}
              onChange={onChangeReference as any /*TODO: improve typing*/}
            />
          </Grid>
        </Grid>
      )}
    </FormSection>
  );
};

export default MessageGeneral;

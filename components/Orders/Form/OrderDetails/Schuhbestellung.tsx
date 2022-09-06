import EnumSelect from '@components/Inputs/EnumSelect';
import FormInput from '@components/Inputs/FormInput';
import { OrderContext } from '@context/OrderContext';
import { EOrderBrand, OrderContextType } from '@customTypes/order';
import { Grid } from '@mui/material';
import { ChangeEvent, FC, useCallback, useContext } from 'react';

const Schuhbestellung: FC = () => {
  const { selected, updateSelected } = useContext(
    OrderContext
  ) as OrderContextType;

  const onChangeBrand = useCallback(
    (value: string | null) => updateSelected('brand', value),
    [updateSelected]
  );
  const onChangeArticle = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('article', e.target.value),
    [updateSelected]
  );
  const onChangeColor = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('color', e.target.value),
    [updateSelected]
  );
  const onChangeDealer = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('dealer', e.target.value),
    [updateSelected]
  );
  const onChangeSize = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      updateSelected('size', parseFloat(e.target.value)),
    [updateSelected]
  );

  return (
    <>
      {selected && (
        <>
          <Grid item xs={6}>
            <EnumSelect
              autocomplete
              freeSolo
              label="Hersteller"
              enumToUse={EOrderBrand}
              inputValue={selected.brand}
              aditionalTextFieldProps={{
                variant: 'filled',
              }}
              onInputChange={onChangeBrand}
            />
          </Grid>
          <Grid item xs={6}>
            <FormInput
              label="Artikel"
              type="text"
              value={selected.article ?? ''}
              onChange={onChangeArticle}
            />
          </Grid>
          <Grid item xs={6}>
            <FormInput
              label="Farbe"
              type="text"
              value={selected.color ?? ''}
              onChange={onChangeColor}
            />
          </Grid>
          <Grid item xs={6}>
            <FormInput
              label="Händler"
              type="text"
              value={selected.dealer ?? ''}
              onChange={onChangeDealer}
            />
          </Grid>
          <Grid item xs={6}>
            <FormInput
              label="Größe"
              type="number"
              value={selected.size ?? ''}
              inputProps={{
                step: '.5',
              }}
              onChange={onChangeSize}
            />
          </Grid>
        </>
      )}
    </>
  );
};

export default Schuhbestellung;

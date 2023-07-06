import {
  OrderShippingTypeLabels,
  OrderTaxLabels,
  OrderTypeLabels,
} from '@consts/order';
import { ECustomerSalutation, EOrderTax } from '@prisma/client';

import { formatDate } from './date';

const SalutationLabels = new Map<ECustomerSalutation, string>([
  [ECustomerSalutation.Mr, 'Sehr geehrter Herr'],
  [ECustomerSalutation.Mrs, 'Sehr geehrte Frau'],
  [ECustomerSalutation.Diverse, 'Sehr geehrte*r Herr/Frau'],
  [ECustomerSalutation.Company, 'Sehr geehrte Damen und Herren'],
]);

export type Replacement = { replaceTemplate: string; replaceValue: string };

const getReplaceTemplate = (prefix: string, key: string): string =>
  `${!prefix.startsWith('{{') ? '{{' : ''}${prefix}.${key}`;

const customKeyActions: Record<
  string,
  (prefix: string, obj: object) => Replacement[]
> = {
  taxes: (prefix: string, obj: any) => {
    const results: Replacement[] = [];
    results.push({
      replaceTemplate: `${getReplaceTemplate(prefix, 'taxes')}}}`,
      replaceValue: getLabel('taxes', obj.taxes),
    });

    const taxShare = obj.price * (obj.taxes == EOrderTax.Seven ? 0.07 : 0.19);
    results.push({
      replaceTemplate: `${getReplaceTemplate(prefix, 'taxShare')}}}`,
      replaceValue: getLabel('taxShare', taxShare),
    });

    const netPrice = obj.price - taxShare;
    results.push({
      replaceTemplate: `${getReplaceTemplate(prefix, 'netPrice')}}}`,
      replaceValue: getLabel('netPrice', netPrice),
    });
    return results;
  },
};

const customLabels: Record<string, (value: any) => string> = {
  taxes: (value) => OrderTaxLabels.get(value) ?? '',
  shippingType: (value) => OrderShippingTypeLabels.get(value) ?? '',
  type: (value) => OrderTypeLabels.get(value) ?? '',
  salutation: (value) => SalutationLabels.get(value) ?? '',
};

const getLabel = (key: string, value: any): string => {
  if (value === null || value === undefined) return '';
  if (customLabels[key]) return customLabels[key](value);
  if (typeof value === 'boolean') return value ? 'Ja' : 'Nein';
  if (value instanceof Date) return formatDate(value);
  if (typeof value === 'number') return value.toFixed(2).replace('.', ',');
  if (typeof value.toString === 'function') return value.toString();
  return '';
};

export const replaceTextFromObject = (
  prefix: string,
  obj: object
): Replacement[] => {
  let results: Replacement[] = [];
  Object.entries(obj).forEach(([key, value]) => {
    const replaceTemplate = getReplaceTemplate(prefix, key);
    if (Array.isArray(value)) {
      value.forEach(
        (x, i) =>
          (results = results.concat(
            replaceTextFromObject(`${replaceTemplate}[${i}]`, x)
          ))
      );
      return;
    }
    if (
      value !== null &&
      typeof value === 'object' &&
      !(value instanceof Date)
    ) {
      results = results.concat(replaceTextFromObject(replaceTemplate, value));
      return;
    }

    customKeyActions[key]
      ? (results = results.concat(customKeyActions[key](prefix, obj)))
      : results.push({
          replaceTemplate: `${replaceTemplate}}}`,
          replaceValue: getLabel(key, value),
        });
  });
  return results;
};

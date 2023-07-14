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
  `${!prefix.startsWith('{{') ? '{{' : ''}${prefix}${prefix ? '.' : ''}${key}`;

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

    const tax = obj.taxes == EOrderTax.Seven ? 0.07 : 0.19;
    const taxShare = (obj.price / (1 + tax)) * tax;
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
  incrementalId: (value) => value?.toString().padStart(4, '0') ?? '',
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
  obj: object,
  prefix: string = ''
): Replacement[] => {
  let results: Replacement[] = [];
  Object.entries(obj).forEach(([key, value]) => {
    const replaceTemplate = getReplaceTemplate(prefix, key);
    if (Array.isArray(value)) {
      value.forEach(
        (x, i) =>
          (results = results.concat(
            replaceTextFromObject(x, `${replaceTemplate}[${i}]`)
          ))
      );
      return;
    }
    if (
      value !== null &&
      typeof value === 'object' &&
      !(value instanceof Date)
    ) {
      results = results.concat(replaceTextFromObject(value, replaceTemplate));
      return;
    }

    customKeyActions[key]
      ? (results = results.concat(customKeyActions[key](prefix, obj)))
      : results.push({
          replaceTemplate: `${replaceTemplate}}}`,
          replaceValue: getLabel(key, value),
        });
  });
  console.log({ results });
  return results;
};

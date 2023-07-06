import {
  OrderShippingTypeLabels,
  OrderSpecificationLabels,
  OrderTaxLabels,
  OrderTypeLabels,
} from '@consts/order';

import { formatDate } from './date';

export type Replacement = { replaceTemplate: string; replaceValue: string };

const customLabels: Record<string, (value: any) => string> = {
  taxes: (value) => OrderTaxLabels.get(value) ?? '',
  shippingType: (value) => OrderShippingTypeLabels.get(value) ?? '',
  type: (value) => OrderTypeLabels.get(value) ?? '',
  specification: (value) => OrderSpecificationLabels.get(value) ?? '',
};

const getLabel = (key: string, value: any): string => {
  if (value === null || value === undefined) return '';
  if (customLabels[key]) return customLabels[key](value);
  if (typeof value === 'boolean') return value ? 'Ja' : 'Nein';
  if (value instanceof Date) return formatDate(value);

  if (typeof value.toString === 'function') return value.toString();
  return '';
};

export const replaceTextFromObject = (
  prefix: string,
  obj: object
): Replacement[] => {
  let results: Replacement[] = [];
  Object.entries(obj).forEach(([key, value]) => {
    const replaceTemplate = `${
      !prefix.startsWith('{{') ? '{{' : ''
    }${prefix}.${key}`;
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

    results.push({
      replaceTemplate: `${replaceTemplate}}}`,
      replaceValue: getLabel(key, value),
    });
  });
  return results;
};

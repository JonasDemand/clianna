import { ColumnFilter, ColumnSorting } from './generated/Api';

export const withColumnFilters = (filters: ColumnFilter[]): string =>
  JSON.stringify(filters);
export const withColumnSorting = (sorting: ColumnSorting[]): string =>
  JSON.stringify(sorting);

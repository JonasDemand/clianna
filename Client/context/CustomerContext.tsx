'use client';

import { columns, defaultVariableColumns } from '@consts/customer';
import { withColumnFilters, withColumnSorting } from '@utils/api/filterParams';
import { ColumnFilter, Customer, Document } from '@utils/api/generated/Api';
import useApiClient from 'hooks/useApiClient';
import useDebounce from 'hooks/useDebounce';
import useDidMountEffect from 'hooks/useDidMountEffect';
import { useSnackbar } from 'notistack';
import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { CustomerContextType, EShowCustomer } from '../types/customer';
import { usePaginationContext } from './PaginationContext';

export const useCustomerContext = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('Context is null');
  }
  return context;
};

const CustomerContext = createContext<CustomerContextType | null>(null);

type CustomerContextProps = {
  children: ReactNode;
  initialCustomers: Customer[];
  initialTemplates: Document[];
};

const CustomerProvider: FC<CustomerContextProps> = ({
  children,
  initialCustomers,
  initialTemplates,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const ApiClient = useApiClient();
  const {
    currentPage,
    gridSortModel,
    searchText,
    setCurrentPage,
    setRowCount,
  } = usePaginationContext();

  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [showCustomers, setShowCustomers] = useState(EShowCustomer.Active);
  const [activeVariableColumns, setActiveVariableColumns] = useState(
    defaultVariableColumns
  );
  const [selected, setSelected] = useState<Customer | null>(null);

  const activeColumns = useMemo(
    () => columns.concat(activeVariableColumns),
    [activeVariableColumns]
  );

  const fetchCustomers = useDebounce(async () => {
    const columnFilters = new Array<ColumnFilter>();
    if (showCustomers !== EShowCustomer.All)
      columnFilters.push({
        name: 'Disabled',
        value: (showCustomers === EShowCustomer.Disabled).toString(),
      });
    const { data, error } = await ApiClient.customer.customerList({
      ColumnFilters: withColumnFilters(columnFilters),
      ColumnSorting: withColumnSorting(
        gridSortModel.map((x) => ({
          name: x.field[0].toUpperCase().concat(x.field.slice(1)),
          desc: x.sort === 'desc',
        }))
      ),
      SearchTerm: searchText,
      PageNumber: currentPage + 1,
      PageSize: 100,
    });
    if (error || !data?.list || !data.metaData) {
      enqueueSnackbar('Unbekannter Fehler', {
        variant: 'error',
      });
      return;
    }
    setCurrentPage(data.metaData.currentPage! - 1);
    setRowCount(data.metaData.totalCount!);
    setCustomers(data.list);
  }, 750);
  useDidMountEffect(
    () => {
      fetchCustomers();
    },
    2,
    [searchText, showCustomers, gridSortModel, currentPage]
  );

  const updateSelected = useCallback(
    <T extends keyof Customer>(property: T, value: Customer[T]) => {
      if (!selected) return;
      let newSelected = { ...selected };
      newSelected[property] = value;
      setSelected(newSelected);
    },
    [selected]
  );

  return (
    <CustomerContext.Provider
      value={{
        customers,
        setCustomers,
        templates: initialTemplates,
        selected,
        setSelected,
        updateSelected,
        showCustomers,
        setShowCustomers,
        activeColumns,
        activeVariableColumns,
        setActiveVariableColumns,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export default CustomerProvider;

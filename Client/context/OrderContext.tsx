'use client';

import { columns, defaultVariableColumns } from '@consts/order';
import { EShowOrder, OrderContextType } from '@customTypes/order';
import { withColumnFilters, withColumnSorting } from '@utils/api/filterParams';
import {
  ColumnFilter,
  Customer,
  Document,
  Order,
} from '@utils/api/generated/Api';
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
  useEffect,
  useMemo,
  useState,
} from 'react';

import { usePaginationContext } from './PaginationContext';

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('Context is null');
  }
  return context;
};

const OrderContext = createContext<OrderContextType | null>(null);

type OrderContextProps = {
  children: ReactNode;
  initialOrders: Order[];
};

const OrderProvider: FC<OrderContextProps> = ({ children, initialOrders }) => {
  const { enqueueSnackbar } = useSnackbar();
  const ApiClient = useApiClient();
  const {
    currentPage,
    gridSortModel,
    searchText,
    setCurrentPage,
    setRowCount,
  } = usePaginationContext();

  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [templates, setTemplates] = useState<Document[]>([]);
  const [showOrders, setShowOrders] = useState(EShowOrder.Pending);
  const [activeVariableColumns, setActiveVariableColumns] = useState(
    defaultVariableColumns
  );
  const [selected, setSelected] = useState<Order | null>(null);
  const [filterCustomer, setFilterCustomer] = useState<Customer | null>(null);

  const activeColumns = useMemo(
    () => columns.concat(activeVariableColumns),
    [activeVariableColumns]
  );

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data, error } = await ApiClient.document.documentList({
        ColumnFilters: withColumnFilters([{ name: 'Template', value: 'true' }]),
        ColumnSorting: withColumnSorting([
          { name: 'CreationDate', desc: true },
        ]),
        PageSize: 1000, //TODO: add pagination
      });
      if (error || !data?.list || !data.metaData) {
        enqueueSnackbar('Unbekannter Fehler', {
          variant: 'error',
        });
        return;
      }
      setTemplates(data.list);
    };
    const fetchCustomers = async () => {
      const { data, error } = await ApiClient.customer.customerList({
        ColumnFilters: withColumnFilters([
          { name: 'Disabled', value: 'false' },
        ]),
        ColumnSorting: withColumnSorting([{ name: 'LastName' }]),
        PageSize: 1000, //TODO: add pagination
      });
      if (error || !data?.list || !data.metaData) {
        enqueueSnackbar('Unbekannter Fehler', {
          variant: 'error',
        });
        return;
      }
      setCustomers(data.list);
    };
    fetchTemplates();
    fetchCustomers();
  }, [ApiClient.customer, ApiClient.document, enqueueSnackbar]);

  const fetchOrders = useDebounce(async () => {
    const columnFilters = new Array<ColumnFilter>();
    if (showOrders !== EShowOrder.All)
      columnFilters.push({
        name: 'Pending',
        value: (showOrders === EShowOrder.Pending).toString(),
      });
    if (filterCustomer)
      columnFilters.push({
        name: 'CustomerId',
        value: filterCustomer.id,
      });
    const { data, error } = await ApiClient.order.orderList({
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
    setOrders(data.list);
  }, 750);
  useDidMountEffect(
    () => {
      fetchOrders();
    },
    1,
    [searchText, showOrders, gridSortModel, currentPage, filterCustomer]
  );

  const updateSelected = useCallback(
    <T extends keyof Order>(property: T, value: Order[T]) => {
      if (!selected) return;
      let newSelected = { ...selected };
      newSelected[property] = value;
      setSelected(newSelected);
    },
    [selected]
  );

  return (
    <OrderContext.Provider
      value={{
        customers,
        templates,
        orders,
        setOrders,
        selected,
        setSelected,
        updateSelected,
        showOrders,
        setShowOrders,
        activeColumns,
        activeVariableColumns,
        setActiveVariableColumns,
        filterCustomer,
        setFilterCustomer,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;

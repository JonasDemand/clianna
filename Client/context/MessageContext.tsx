'use client';

import { columns, defaultVariableColumns } from '@consts/message';
import { MessageContextType } from '@customTypes/message';
import { EShowTemplate } from '@customTypes/template';
import { withColumnFilters, withColumnSorting } from '@utils/api/filterParams';
import {
  ColumnFilter,
  Customer,
  Message,
  Order,
} from '@utils/api/generated/Api';
import { isCustomer } from '@utils/customer';
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

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('Context is null');
  }
  return context;
};

const MessageContext = createContext<MessageContextType | null>(null);

type MessageContextProps = {
  children: ReactNode;
  initialMessages: Message[];
};

const MessageProvider: FC<MessageContextProps> = ({
  children,
  initialMessages,
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

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showMessages, setShowMessages] = useState(EShowTemplate.All);
  const [activeVariableColumns, setActiveVariableColumns] = useState(
    defaultVariableColumns
  );
  const [selected, setSelected] = useState<Message | null>(null);
  const [filterReference, setFilterReference] = useState<
    Customer | Order | null
  >(null);

  const activeColumns = useMemo(
    () => columns.concat(activeVariableColumns),
    [activeVariableColumns]
  );

  useEffect(() => {
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
    const fetchOrders = async () => {
      const { data, error } = await ApiClient.order.orderList({
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
      setOrders(data.list);
    };
    fetchCustomers();
    fetchOrders();
  }, [
    ApiClient.customer,
    ApiClient.document,
    ApiClient.order,
    enqueueSnackbar,
  ]);

  const fetchMessages = useDebounce(async () => {
    const columnFilters = new Array<ColumnFilter>();
    if (showMessages !== EShowTemplate.All)
      columnFilters.push({
        name: 'Template',
        value: showMessages.toString(),
      });
    if (filterReference)
      columnFilters.push({
        name: isCustomer(filterReference) ? 'CustomerId' : 'OrderId',
        value: filterReference.id,
      });
    const { data, error } = await ApiClient.message.messageList({
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
    setMessages(data.list);
  }, 750);
  useDidMountEffect(
    () => {
      fetchMessages();
    },
    1,
    [searchText, showMessages, gridSortModel, currentPage, filterReference]
  );

  const updateSelected = useCallback(
    (updates: Message) => {
      if (!selected) return;
      let newSelected = { ...selected };
      Object.entries(updates).forEach(
        ([key, value]) =>
          //@ts-ignore
          (newSelected[key] = value)
      );
      setSelected(newSelected);
    },
    [selected]
  );

  return (
    <MessageContext.Provider
      value={{
        customers,
        orders,
        messages,
        setMessages,
        setShowMessages,
        showMessages,
        selected,
        setSelected,
        updateSelected,
        activeColumns,
        activeVariableColumns,
        setActiveVariableColumns,
        filterReference,
        setFilterReference,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;

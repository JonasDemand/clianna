'use client';

import { columns, defaultVariableColumns } from '@consts/order';
import { EShowOrder, OrderContextType } from '@customTypes/order';
import { Customer, Document, Order } from '@utils/api/generated/Api';
import { searchArray } from '@utils/search';
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
  initialCustomers: Customer[];
  initialTemplates: Document[];
  initialOrders: Order[];
};

const OrderProvider: FC<OrderContextProps> = ({
  children,
  initialCustomers,
  initialOrders,
  initialTemplates,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrders, setShowOrders] = useState(EShowOrder.Pending);
  const [activeVariableColumns, setActiveVariableColumns] = useState(
    defaultVariableColumns
  );
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);

  const activeColumns = useMemo(
    () => columns.concat(activeVariableColumns),
    [activeVariableColumns]
  );
  /*TODO: Improve search to only search in keys
  const searchKeys = useMemo(
    () => activeColumns.map((x) => x.field),
    [activeColumns]
  );*/
  const filteredOrders = useMemo(() => {
    const pendingValue = showOrders === EShowOrder.Pending;
    const ordersToSearch =
      showOrders === EShowOrder.All
        ? orders
        : orders.filter((order) => order.pending === pendingValue);

    return searchArray(ordersToSearch, searchText);
  }, [orders, searchText, showOrders]);

  useEffect(() => {
    setOrders(initialOrders);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        customers: initialCustomers,
        templates: initialTemplates,
        orders,
        setOrders,
        filteredOrders,
        selected,
        setSelected,
        updateSelected,
        showOrders,
        setShowOrders,
        activeColumns,
        activeVariableColumns,
        setActiveVariableColumns,
        searchText,
        setSearchText,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;

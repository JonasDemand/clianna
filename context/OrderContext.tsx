import { columns, defaultVariableColumns } from '@consts/order';
import { IOrderWithCustomer } from '@customTypes/database/order';
import { EShowOrder, OrderContextType } from '@customTypes/order';
import { Customer } from '@prisma/client';
import {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const OrderContext = createContext<OrderContextType | null>(null);

type OrderContextProps = {
  children: ReactNode;
  initialCustomers: Customer[];
  initialOrders: IOrderWithCustomer[];
};

const OrderProvider: FC<OrderContextProps> = ({
  children,
  initialCustomers,
  initialOrders,
}) => {
  const [orders, setOrders] = useState<IOrderWithCustomer[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showOrders, setShowOrders] = useState(EShowOrder.Pending);
  const [activeVariableColumns, setActiveVariableColumns] = useState(
    defaultVariableColumns
  );
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState<IOrderWithCustomer | null>(null);

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
    const searchTerms = searchText
      .split(' ')
      .map((txt) => `.*${txt.toLowerCase()}.*`);
    const pendingValue = showOrders === EShowOrder.Pending;
    const ordersToSearch =
      showOrders === EShowOrder.All
        ? orders
        : orders.filter((order) => order.pending === pendingValue);

    return ordersToSearch.filter((order) => {
      const searchText = JSON.stringify(order).toLowerCase();
      return searchTerms.every((term) => searchText.match(term));
    });
  }, [orders, searchText, showOrders]);

  useEffect(() => {
    setCustomers(initialCustomers);
    setOrders(initialOrders);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OrderContext.Provider
      value={{
        customers,
        setCustomers,
        orders,
        setOrders,
        filteredOrders,
        selected,
        setSelected,
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

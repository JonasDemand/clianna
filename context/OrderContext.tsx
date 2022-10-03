import { columns, defaultVariableColumns } from '@consts/order';
import { ICustomer } from '@customTypes/database/customer';
import { IOrderWithDependencies } from '@customTypes/database/order';
import { EShowOrder, OrderContextType } from '@customTypes/order';
import { searchArray } from '@utils/search';
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const OrderContext = createContext<OrderContextType | null>(null);

type OrderContextProps = {
  children: ReactNode;
  initialCustomers: ICustomer[];
  initialOrders: IOrderWithDependencies[];
};

const OrderProvider: FC<OrderContextProps> = ({
  children,
  initialCustomers,
  initialOrders,
}) => {
  const [orders, setOrders] = useState<IOrderWithDependencies[]>([]);
  const [showOrders, setShowOrders] = useState(EShowOrder.Pending);
  const [activeVariableColumns, setActiveVariableColumns] = useState(
    defaultVariableColumns
  );
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState<IOrderWithDependencies | null>(null);

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
    <T extends keyof IOrderWithDependencies>(
      property: T,
      value: IOrderWithDependencies[T]
    ) => {
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

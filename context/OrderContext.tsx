import { columns, defaultColumns, defaultOrder } from '@consts/order';
import { IOrderWithCustomer } from '@customTypes/database/order';
import { OrderContextType, ShowOrders } from '@customTypes/order';
import { Customer } from '@prisma/client';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
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
  const router = useRouter();
  const { data: session } = useSession();
  const [queryInitialized, setQueryInitialized] = useState(false);

  const [orders, setOrders] = useState<IOrderWithCustomer[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showOrders, setShowOrders] = useState(ShowOrders.Pending);
  const [activeColumns, setActiveColumns] = useState(defaultColumns);
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState<IOrderWithCustomer | null>(null);

  const searchKeys = useMemo(
    () => activeColumns.map((x) => x.field),
    [activeColumns]
  );
  const filteredOrders = useMemo(() => {
    const cleanedSearch = `.*${searchText.toLowerCase().replace(' ', '.*')}.*`;
    const pendingValue = showOrders === ShowOrders.Pending;
    const ordersToSearch =
      showOrders === ShowOrders.All
        ? orders
        : orders.filter((customer) => customer.pending === pendingValue);

    return ordersToSearch.filter((order) =>
      Object.keys(order).some((key) => {
        if (searchKeys.includes(key))
          return (order[key as keyof IOrderWithCustomer]?.toString() ?? '')
            .toLowerCase()
            .match(cleanedSearch);
      })
    );
  }, [activeColumns, orders, searchText]);

  useEffect(() => {
    setCustomers(initialCustomers);
    setOrders(initialOrders);
  }, [initialCustomers, initialOrders]);

  //Read from query
  useEffect(() => {
    if (!router.isReady || !session) return;
    router.query['searchText'] &&
      setSearchText(decodeURIComponent(router.query['searchText'] as string));
    router.query['showOrders'] &&
      setShowOrders(
        parseInt(decodeURIComponent(router.query['showOrders'] as string), 10)
      );
    router.query['activeColumns'] &&
      setActiveColumns(
        (
          JSON.parse(
            decodeURIComponent(router.query['activeColumns'] as string)
          ) as string[]
        ).map((key) => columns.find((column) => column.field === key)!)
      );
    router.query['selectedId'] &&
      !selected &&
      setSelected(
        (filteredOrders.find(
          (customer) =>
            customer.id ===
            parseInt(
              decodeURIComponent(router.query['selectedId'] as string),
              10
            )
        ) as IOrderWithCustomer) ?? defaultOrder()
      );
    setQueryInitialized(true);
  }, [router.isReady, session]);

  //Write to query
  useEffect(() => {
    if (!queryInitialized) return;
    router.push(
      `/orders?searchText=${encodeURIComponent(
        searchText
      )}&shhowOrders=${encodeURIComponent(
        showOrders
      )}&selectedId=${encodeURIComponent(
        selected?.id.toString() ?? ''
      )}&activeColumns=${encodeURIComponent(JSON.stringify(searchKeys))}`,
      undefined,
      {
        shallow: true,
      }
    );
  }, [queryInitialized, searchText, showOrders, activeColumns, selected?.id]);

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
        setActiveColumns,
        searchText,
        setSearchText,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;

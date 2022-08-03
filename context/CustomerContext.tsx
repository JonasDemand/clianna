import { columns, defaultColumns, defaultCustomer } from '@consts/customer';
import { ICustomerWithOrders } from '@customTypes/database/customer';
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

import { CustomerContextType, ShowCustomers } from '../types/customer';

export const CustomerContext = createContext<CustomerContextType | null>(null);

type CustomerContextProps = {
  children: ReactNode;
  initialCustomers: ICustomerWithOrders[];
};

const CustomerProvider: FC<CustomerContextProps> = ({
  children,
  initialCustomers,
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [queryInitialized, setQueryInitialized] = useState(false);

  const [customers, setCustomers] = useState<ICustomerWithOrders[]>([]);
  const [showCustomers, setShowCustomers] = useState(ShowCustomers.Active);
  const [activeColumns, setActiveColumns] = useState(defaultColumns);
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState<ICustomerWithOrders | null>(null);

  const searchKeys = useMemo(
    () => activeColumns.map((x) => x.field),
    [activeColumns]
  );
  const filteredCustomers = useMemo(() => {
    const searchTerms = searchText
      .split(' ')
      .map((txt) => `.*${txt.toLowerCase()}.*`);
    const pendingValue = showCustomers === ShowCustomers.Disabled;
    const customersToSearch =
      showCustomers === ShowCustomers.All
        ? customers
        : customers.filter((customer) => customer.disabled === pendingValue);

    return customersToSearch.filter((customer) => {
      const searchText = JSON.stringify(customer).toLowerCase();
      return searchTerms.every((term) => searchText.match(term));
    });
  }, [searchText, showCustomers, customers]);

  useEffect(() => setCustomers(initialCustomers), []);

  //Read from query
  useEffect(() => {
    if (!router.isReady || !session) return;
    router.query['searchText'] &&
      setSearchText(decodeURIComponent(router.query['searchText'] as string));
    router.query['showCustomers'] &&
      setShowCustomers(
        parseInt(
          decodeURIComponent(router.query['showCustomers'] as string),
          10
        )
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
        (filteredCustomers.find(
          (customer) =>
            customer.id ===
            parseInt(
              decodeURIComponent(router.query['selectedId'] as string),
              10
            )
        ) as ICustomerWithOrders) ?? defaultCustomer()
      );
    setQueryInitialized(true);
  }, [router.isReady, session?.user]);

  //Write to query
  useEffect(() => {
    if (!queryInitialized) return;
    router.push(
      `/customers?searchText=${encodeURIComponent(
        searchText
      )}&showCustomers=${encodeURIComponent(
        showCustomers
      )}&selectedId=${encodeURIComponent(
        selected?.id.toString() ?? ''
      )}&activeColumns=${encodeURIComponent(JSON.stringify(searchKeys))}`,
      undefined,
      {
        shallow: true,
      }
    );
  }, [
    queryInitialized,
    searchText,
    showCustomers,
    activeColumns,
    selected?.id,
  ]);

  return (
    <CustomerContext.Provider
      value={{
        customers,
        setCustomers,
        filteredCustomers,
        selected,
        setSelected,
        showCustomers,
        setShowCustomers,
        activeColumns,
        setActiveColumns,
        searchText,
        setSearchText,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export default CustomerProvider;

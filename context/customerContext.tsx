import { useRouter } from 'next/router';
import {
  createContext,
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { CustomerContextType, ICustomerWithOrders } from '../@types/customer';
import { defaultColumns, columnNames } from '../consts/customers';

export const CustomerContext = createContext<CustomerContextType | null>(null);

type CustomerContextProps = {
  children: ReactNode;
};

const CustomerProvider: FunctionComponent<CustomerContextProps> = ({
  children,
}) => {
  const router = useRouter();
  const [queryInitialized, setQueryInitialized] = useState(false);

  const [customers, setCustomers] = useState<ICustomerWithOrders[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<
    ICustomerWithOrders[]
  >([]);
  const [showDisabled, setShowDisabled] = useState(false);
  const [activeColumns, setActiveColumns] = useState(defaultColumns);
  const [searchText, setSearchText] = useState('');

  const [selected, setSelected] = useState<ICustomerWithOrders | null>(null);
  const [selectedDisabled, setSelectedDisabled] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;
    router.query['searchText'] &&
      setSearchText(decodeURIComponent(router.query['searchText'].toString()));
    router.query['showDisabled'] &&
      setShowDisabled(router.query['showDisabled'].toString() === 'true');
    setQueryInitialized(true);
  }, [router.isReady]);
  useEffect(() => {
    if (!queryInitialized) return;
    router.push(
      '/customers',
      `/customers?searchText=${encodeURIComponent(
        searchText
      )}&showDisabled=${showDisabled}}`,
      {
        shallow: true,
      }
    );
  }, [searchText, showDisabled]);

  useEffect(() => {
    const cleanedSearch = `.*${searchText.toLowerCase().replace(' ', '.*')}.*`;
    setFilteredCustomers(
      customers.filter((customer) =>
        Object.keys(customer).some((key) => {
          if (activeColumns.includes(columnNames[key]))
            //@ts-expect-error
            return customer[key]?.toString().toLowerCase().match(cleanedSearch);
        })
      )
    );
  }, [activeColumns, customers, searchText]);
  useEffect(() => {
    if (!selected) return;
    const newCust = customers.filter(
      (customer) => customer.id === selected.id
    )[0];
    setSelected(newCust);
  }, [customers]);

  return (
    <CustomerContext.Provider
      value={{
        customers,
        setCustomers,
        filteredCustomers,
        setFilteredCustomers,
        selected,
        setSelected,
        selectedDisabled,
        setSelectedDisabled,
        showDisabled,
        setShowDisabled,
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

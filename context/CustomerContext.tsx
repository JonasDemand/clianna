import { defaultColumns } from '@consts/customer';
import { ICustomerWithOrders } from '@customTypes/database/customer';
import {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { CustomerContextType, ShowCustomer } from '../types/customer';

export const CustomerContext = createContext<CustomerContextType | null>(null);

type CustomerContextProps = {
  children: ReactNode;
  initialCustomers: ICustomerWithOrders[];
};

const CustomerProvider: FC<CustomerContextProps> = ({
  children,
  initialCustomers,
}) => {
  const [customers, setCustomers] = useState<ICustomerWithOrders[]>([]);
  const [showCustomers, setShowCustomers] = useState(ShowCustomer.Active);
  const [activeColumns, setActiveColumns] = useState(defaultColumns);
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState<ICustomerWithOrders | null>(null);

  /*TODO: Improve search to only search in keys
  const searchKeys = useMemo(
    () => activeColumns.map((x) => x.field),
    [activeColumns]
  );*/
  const filteredCustomers = useMemo(() => {
    const searchTerms = searchText
      .split(' ')
      .map((txt) => `.*${txt.toLowerCase()}.*`);
    const pendingValue = showCustomers === ShowCustomer.Disabled;
    const customersToSearch =
      showCustomers === ShowCustomer.All
        ? customers
        : customers.filter((customer) => customer.disabled === pendingValue);

    return customersToSearch.filter((customer) => {
      const searchText = JSON.stringify(customer).toLowerCase();
      return searchTerms.every((term) => searchText.match(term));
    });
  }, [searchText, showCustomers, customers]);

  useEffect(() => setCustomers(initialCustomers), []);

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

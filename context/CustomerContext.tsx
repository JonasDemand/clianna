import { columns, defaultVariableColumns } from '@consts/customer';
import { ICustomerWithOrders } from '@customTypes/database/customer';
import {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { CustomerContextType, EShowCustomer } from '../types/customer';

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
  const [showCustomers, setShowCustomers] = useState(EShowCustomer.Active);
  const [activeVariableColumns, setActiveVariableColumns] = useState(
    defaultVariableColumns
  );
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState<ICustomerWithOrders | null>(null);

  const activeColumns = useMemo(
    () => columns.concat(activeVariableColumns),
    [activeVariableColumns]
  );

  /*TODO: Improve search to only search in keys
  const searchKeys = useMemo(
    () => activeColumns.map((x) => x.field),
    [activeColumns]
  );*/
  const filteredCustomers = useMemo(() => {
    const searchTerms = searchText
      .split(' ')
      .map((txt) => `.*${txt.toLowerCase()}.*`);
    const pendingValue = showCustomers === EShowCustomer.Disabled;
    const customersToSearch =
      showCustomers === EShowCustomer.All
        ? customers
        : customers.filter((customer) => customer.disabled === pendingValue);

    return customersToSearch.filter((customer) => {
      const searchText = JSON.stringify(customer).toLowerCase();
      return searchTerms.every((term) => searchText.match(term));
    });
  }, [searchText, showCustomers, customers]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        activeVariableColumns,
        setActiveVariableColumns,
        searchText,
        setSearchText,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export default CustomerProvider;

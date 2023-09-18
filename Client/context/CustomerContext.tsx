import { columns, defaultVariableColumns } from '@consts/customer';
import { Customer, Document } from '@utils/api/generated/GENERATED_Client';
import { searchArray } from '@utils/search';
import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { CustomerContextType, EShowCustomer } from '../types/customer';

export const CustomerContext = createContext<CustomerContextType | null>(null);

type CustomerContextProps = {
  children: ReactNode;
  initialCustomers: Customer[];
  initialTemplates: Document[];
};

const CustomerProvider: FC<CustomerContextProps> = ({
  children,
  initialCustomers,
  initialTemplates,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showCustomers, setShowCustomers] = useState(EShowCustomer.Active);
  const [activeVariableColumns, setActiveVariableColumns] = useState(
    defaultVariableColumns
  );
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState<Customer | null>(null);

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
    const pendingValue = showCustomers === EShowCustomer.Disabled;
    const customersToSearch =
      showCustomers === EShowCustomer.All
        ? customers
        : customers.filter((customer) => customer.disabled === pendingValue);

    return searchArray(customersToSearch, searchText);
  }, [searchText, showCustomers, customers]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setCustomers(initialCustomers), []);

  const updateSelected = useCallback(
    <T extends keyof Customer>(property: T, value: Customer[T]) => {
      if (!selected) return;
      let newSelected = Customer.fromJS({ ...selected });
      newSelected[property] = value;
      setSelected(newSelected);
    },
    [selected]
  );

  return (
    <CustomerContext.Provider
      value={{
        customers,
        setCustomers,
        filteredCustomers,
        templates: initialTemplates,
        selected,
        setSelected,
        updateSelected,
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

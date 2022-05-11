import { createContext, FunctionComponent, ReactNode, useState } from 'react';
import { CustomerContextType, ICustomerWithOrders } from '../@types/customer';

export const CustomerContext = createContext<CustomerContextType | null>(null);

type CustomerContextProps = {
  children: ReactNode;
};

const CustomerProvider: FunctionComponent<CustomerContextProps> = ({
  children,
}) => {
  const [customers, setCustomers] = useState<ICustomerWithOrders[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<
    ICustomerWithOrders[]
  >([]);
  const [selected, setSelected] = useState<ICustomerWithOrders | null>(null);
  const [selectedDisabled, setSelectedDisabled] = useState(true);
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
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export default CustomerProvider;

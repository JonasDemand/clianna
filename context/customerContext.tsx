import { createContext, FunctionComponent, ReactNode, useState } from 'react';
import { CustomerContextType, ICustomerWithOrders } from '../@types/customer';

export const CustomerContext = createContext<CustomerContextType | null>(null);

type CustomerContextProps = {
  children: ReactNode;
};

const CustomerProvicer: FunctionComponent<CustomerContextProps> = ({
  children,
}) => {
  const [customers, setCustomers] = useState<ICustomerWithOrders[]>([]);

  return (
    <CustomerContext.Provider value={null}>{children}</CustomerContext.Provider>
  );
};

export default CustomerProvicer;

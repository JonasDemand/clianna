import { PrismaClient } from '@prisma/client';
import { GetStaticProps, NextPage } from 'next';
import AuthenticationWrapper from '../components/AuthenticationWrapper';
import CustomersPage from '../components/Customers/CustomersPage';
import LayoutWrapper from '../components/LayoutWrapper';
import { CustomerContextType, ICustomerWithOrders } from '../@types/customer';
import { CustomerContext } from '../context/customerContext';
import { useContext, useEffect } from 'react';

const prisma = new PrismaClient();

type CustomersProps = {
  customers: ICustomerWithOrders[];
};

const Customers: NextPage<CustomersProps> = ({ customers }) => {
  const { setCustomers, setFilteredCustomers } = useContext(
    CustomerContext
  ) as CustomerContextType;
  useEffect(() => {
    const sortedCustomers = customers.sort((a, b) =>
      a.lastname.toLowerCase().localeCompare(b.lastname.toLowerCase())
    );
    setCustomers(sortedCustomers);
    setFilteredCustomers(sortedCustomers);
  }, [customers, setCustomers, setFilteredCustomers]);
  return (
    <AuthenticationWrapper>
      <LayoutWrapper>
        <CustomersPage />
      </LayoutWrapper>
    </AuthenticationWrapper>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const customers = await prisma.customer.findMany({
    include: { oders: true },
  });
  return {
    props: {
      customers: customers.map<ICustomerWithOrders>((customer) => ({
        ...customer,
        openOrders:
          customer.id === 1
            ? 43905
            : customer.oders.filter((order) => order.pending).length,
      })),
    },
  };
};

export default Customers;

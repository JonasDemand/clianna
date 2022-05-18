import { PrismaClient } from '@prisma/client';
import { GetStaticProps, NextPage } from 'next';
import AuthenticationWrapper from '../components/AuthenticationWrapper';
import CustomersPage from '../components/Customers/CustomersPage';
import LayoutWrapper from '../components/LayoutWrapper';
import { CustomerContextType, ICustomerWithOrders } from '../@types/customer';
import CustomerProvider, { CustomerContext } from '../context/customerContext';
import { useContext, useEffect } from 'react';

const prisma = new PrismaClient();

type CustomersProps = {
  customers: ICustomerWithOrders[];
};

const Customers: NextPage<CustomersProps> = ({ customers }) => {
  return (
    <AuthenticationWrapper>
      <LayoutWrapper>
        <CustomerProvider>
          <CustomersPage customers={customers} />
        </CustomerProvider>
      </LayoutWrapper>
    </AuthenticationWrapper>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const customers = await prisma.customer.findMany({
    include: { orders: true },
  });
  return {
    props: {
      customers: customers
        .sort((a, b) =>
          a.lastname.toLowerCase().localeCompare(b.lastname.toLowerCase())
        )
        .map<ICustomerWithOrders>((customer) => ({
          ...customer,
          openOrders: customer.orders.filter((order) => order.pending).length,
        })),
    },
  };
};

export default Customers;

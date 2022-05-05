import { PrismaClient } from '@prisma/client';
import { GetStaticProps, NextPage } from 'next';
import AuthenticationWrapper from '../components/AuthenticationWrapper';
import CustomersTable from '../components/CustomersTable';
import LayoutWrapper from '../components/LayoutWrapper';
import { ICustomerWithOrders } from '../@types/customer';

const prisma = new PrismaClient();

type CustomersProps = {
  customers: ICustomerWithOrders[];
};

const Customers: NextPage<CustomersProps> = ({ customers }) => {
  return (
    <AuthenticationWrapper>
      <LayoutWrapper>
        <CustomersTable customers={customers} />
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
      customers,
    },
  };
};

export default Customers;

import { Customer, PrismaClient } from '@prisma/client';
import { NextPage } from 'next';
import AuthenticationWrapper from '../components/AuthenticationWrapper';
import CustomersTable from '../components/CustomersTable';

const prisma = new PrismaClient();

type CustomersProps = {
  customers: Customer[];
};

const Customers: NextPage<CustomersProps> = ({ customers }) => {
  return (
    <AuthenticationWrapper>
      <CustomersTable customers={customers} />
    </AuthenticationWrapper>
  );
};

export const getStaticProps = async () => {
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

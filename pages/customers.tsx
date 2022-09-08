import AuthenticationWrapper from '@components/Authentication/AuthenticationWrapper';
import LayoutWrapper from '@components/Layout/LayoutWrapper';
import CustomersPage from '@components/Pages/Customers/CustomersPage';
import CustomerProvider from '@context/CustomerContext';
import { ICustomerWithOrders } from '@customTypes/database/customer';
import { DbRepo } from '@utils/DbRepo';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useEffect } from 'react';

type CustomersProps = {
  customers: ICustomerWithOrders[];
};

const Customers: NextPage<CustomersProps> = ({ customers }) => {
  const session = useSession();
  useEffect(() => console.log(session), [session]);
  return (
    <AuthenticationWrapper>
      <LayoutWrapper>
        <CustomerProvider initialCustomers={customers}>
          <CustomersPage />
        </CustomerProvider>
      </LayoutWrapper>
    </AuthenticationWrapper>
  );
};

export const getServerSideProps: GetServerSideProps<CustomersProps> = async (
  context
) => {
  const session = await getSession(context);
  if (!session) return { props: { customers: [] } };
  DbRepo.Init(session.user.id ?? '');
  return {
    props: {
      customers: await DbRepo.Instance.Customer.GetAll(true),
    },
  };
};

export default Customers;

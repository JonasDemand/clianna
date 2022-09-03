import AuthenticationWrapper from '@components/Authentication/AuthenticationWrapper';
import CustomersPage from '@components/Customers/CustomersPage';
import LayoutWrapper from '@components/Layout/LayoutWrapper';
import CustomerProvider from '@context/CustomerContext';
import { ICustomerWithOrders } from '@customTypes/database/customer';
import { DbRepo } from '@utils/DbRepo';
import { GetServerSideProps, NextPage } from 'next';

type CustomersProps = {
  customers: ICustomerWithOrders[];
};

const Customers: NextPage<CustomersProps> = ({ customers }) => {
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

export const getServerSideProps: GetServerSideProps<
  CustomersProps
> = async () => ({
  props: {
    customers: await DbRepo.Current.Customer.GetAll(true),
  },
});

export default Customers;

import { Customer } from '@prisma/client';
import { FunctionComponent } from 'react';

type CustomersTableProps = {
  customers: Customer[];
};

const CustomersTable: FunctionComponent<CustomersTableProps> = ({
  customers,
}) => {
  return <div>{JSON.stringify(customers)}</div>;
};

export default CustomersTable;

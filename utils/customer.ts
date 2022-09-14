import {
  ICustomer,
  ICustomerWithDependencies,
} from '@customTypes/database/customer';

export const getCustomerLabel = (
  customer: ICustomerWithDependencies | ICustomer | null | undefined
) =>
  customer
    ? `${customer.id}${customer.firstname || customer.lastname ? ' -' : ''}${
        customer.firstname ? ` ${customer.firstname}` : ''
      }${customer.lastname ? ` ${customer.lastname}` : ''}`
    : '';

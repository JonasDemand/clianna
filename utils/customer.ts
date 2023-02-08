import {
  ICustomer,
  ICustomerWithDependencies,
} from '@customTypes/database/customer';

export const getCustomerLabel = (
  customer: ICustomerWithDependencies | ICustomer | null | undefined
) =>
  customer
    ? `${!customer.firstname && !customer.lastname ? 'Kunde ohne Name' : ''}${
        customer.firstname ? ` ${customer.firstname}` : ''
      }${customer.lastname ? ` ${customer.lastname}` : ''}`
    : '';

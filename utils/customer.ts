import { ICustomer, ICustomerWithOrders } from '@customTypes/database/customer';

export const getCustomerLabel = (
  customer: ICustomerWithOrders | ICustomer | null | undefined
) =>
  customer
    ? `${customer.id}${customer.firstname || customer.lastname ? ' -' : ''}${
        customer.firstname ? ` ${customer.firstname}` : ''
      }${customer.lastname ? ` ${customer.lastname}` : ''}`
    : '';

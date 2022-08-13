import { Customer } from '@prisma/client';

export const getCustomerDisplay = (customer: Customer | null) =>
  customer
    ? `${customer.id}${customer.firstname || customer.lastname ? ' -' : ''}${
        customer.firstname ? ` ${customer.firstname}` : ''
      }${customer.lastname ? ` ${customer.lastname}` : ''}`
    : '';

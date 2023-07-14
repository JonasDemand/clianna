import {
  ICustomer,
  ICustomerWithDependencies,
} from '@customTypes/database/customer';

export const getCustomerLabel = (
  customer: ICustomerWithDependencies | ICustomer | null | undefined
) =>
  customer?.firstname || customer?.lastname
    ? `${customer.firstname ?? ''} ${customer.lastname ?? ''}`
    : customer
    ? 'Kunde ohne Name'
    : 'Kunde nicht verfügbar';

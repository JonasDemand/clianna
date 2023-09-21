import { Customer } from './api/generated/Api';

export const getCustomerLabel = (customer: Customer | null | undefined) =>
  customer?.firstName || customer?.lastName
    ? `${customer.firstName ?? ''} ${customer.lastName ?? ''}`
    : customer
    ? 'Kunde ohne Name'
    : 'Kunde nicht verfügbar';

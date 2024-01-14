import { Customer, UpsertCustomerRequest } from './api/generated/Api';

export const getCustomerLabel = (customer: Customer | null | undefined) =>
  customer?.firstName || customer?.lastName
    ? `${customer.firstName ?? ''} ${customer.lastName ?? ''}`
    : customer
    ? 'Kunde ohne Name'
    : 'Kunde nicht verfügbar';

export const toCustomerUpsertRequest = (
  customer: Customer
): UpsertCustomerRequest => ({
  ...customer,
  orders: customer.orders?.map((x) => x.id!),
  documents: customer.documents?.map((x) => x.id!),
});

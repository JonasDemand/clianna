import { IOrderWithCustomer } from '@customTypes/database/order';

export interface IUpsertRequest
  extends Omit<IOrderWithCustomer, 'id' | 'creationDate'> {}

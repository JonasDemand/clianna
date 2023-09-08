import { IOrderWithDependencies } from '@customTypes/database/order';

export interface IUpsertRequest
  extends Omit<IOrderWithDependencies, 'id' | 'creationDate'> {}

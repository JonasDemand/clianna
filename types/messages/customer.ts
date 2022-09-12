import { ICustomerWithOrders } from '@customTypes/database/customer';

export interface IUpsertRequest extends Omit<ICustomerWithOrders, 'id'> {}

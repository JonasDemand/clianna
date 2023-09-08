import { ICustomerWithDependencies } from '@customTypes/database/customer';

export interface IUpsertRequest extends Omit<ICustomerWithDependencies, 'id'> {}

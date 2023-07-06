import { IOrder, IOrderWithDependencies } from '@customTypes/database/order';

import { formatDate } from './date';

export const getOrderLabel = (
  order: IOrderWithDependencies | IOrder | null | undefined
) =>
  order
    ? `${!order.type && !order.creationDate ? 'Auftrag ohne Infos' : ''}${
        order.type ? ` ${order.type}` : 'Kein Typ'
      } - ${formatDate(order.creationDate)}`
    : '';

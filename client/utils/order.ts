import { OrderTypeLabels } from '@consts/order';
import { IOrder, IOrderWithDependencies } from '@customTypes/database/order';

import { formatDate } from './date';

export const getOrderLabel = (
  order: IOrderWithDependencies | IOrder | null | undefined
) =>
  order?.type || order?.creationDate
    ? `${
        order.type ? ` ${OrderTypeLabels.get(order.type)}` : 'Kein Typ'
      } - ${formatDate(order.creationDate)}`
    : order
    ? 'Auftrag ohne Infos'
    : 'Auftrag nicht verfügbar';

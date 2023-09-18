import { OrderTypeLabels } from '@consts/order';

import { Order } from './api/generated/GENERATED_Client';
import { formatDate } from './date';

export const getOrderLabel = (order: Order | null | undefined) =>
  order?.type || order?.creationDate
    ? `${
        order.type ? ` ${OrderTypeLabels.get(order.type)}` : 'Kein Typ'
      } - ${formatDate(order.creationDate)}`
    : order
    ? 'Auftrag ohne Infos'
    : 'Auftrag nicht verfügbar';

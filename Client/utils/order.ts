import { OrderTypeLabels } from '@consts/order';

import { Order, UpsertOrderRequest } from './api/generated/Api';
import { formatDate } from './date';

export const getOrderLabel = (order: Order | null | undefined) =>
  order?.type || order?.creationDate
    ? `${
        order.type ? ` ${OrderTypeLabels.get(order.type)}` : 'Kein Typ'
      } - ${formatDate(order.creationDate)}`
    : order
    ? 'Auftrag ohne Infos'
    : 'Auftrag nicht verfügbar';

export const toOrderUpsertRequest = (order: Order): UpsertOrderRequest => ({
  ...order,
  customer: order.customer?.id ?? null,
  documents: order.documents?.map((x) => x.id!),
  messages: order.messages?.map((x) => x.id!),
});

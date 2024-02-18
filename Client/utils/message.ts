import { Message, UpsertMessageRequest } from './api/generated/Api';
import { formatDate } from './date';

export const getMessageLabel = (message: Message | null | undefined) =>
  message?.name || message?.creationDate
    ? `${message.name ?? 'Kein Name'} - ${formatDate(message.creationDate)}`
    : message
    ? 'Nachricht ohne Infos'
    : 'Nachricht nicht verfügbar';

export const toMessageUpsertRequest = (
  message: Message
): UpsertMessageRequest => ({
  ...message,
  order: message.order?.id,
  customer: message.customer?.id,
});

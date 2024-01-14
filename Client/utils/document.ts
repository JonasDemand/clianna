import { Document, UpsertDocumentReqeust } from './api/generated/Api';
import { formatDate } from './date';

export const getDocumentLabel = (document: Document | null | undefined) =>
  document?.name || document?.creationDate
    ? `${document.name ?? 'Kein Typ'} - ${formatDate(document.creationDate)}`
    : document
    ? 'Dokument ohne Infos'
    : 'Dokument nicht verfügbar';

export const toDocumentUpsertRequest = (
  document: Document
): UpsertDocumentReqeust => ({
  ...document,
  order: document.order?.id,
  customer: document.customer?.id,
});

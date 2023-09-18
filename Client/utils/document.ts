import { Document } from './api/generated/GENERATED_Client';
import { formatDate } from './date';

export const getDocumentLabel = (document: Document | null | undefined) =>
  document?.name || document?.creationDate
    ? `${document.name ?? 'Kein Typ'} - ${formatDate(document.creationDate)}`
    : document
    ? 'Dokument ohne Infos'
    : 'Dokument nicht verfügbar';

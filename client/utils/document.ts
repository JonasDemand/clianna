import {
  IDocument,
  IDocumentWithDependencies,
} from '@customTypes/database/document';

import { formatDate } from './date';

export const getDocumentLabel = (
  document: IDocument | IDocumentWithDependencies | null | undefined
) =>
  document?.name || document?.creationDate
    ? `${document.name ?? 'Kein Typ'} - ${formatDate(document.creationDate)}`
    : document
    ? 'Dokument ohne Infos'
    : 'Dokument nicht verfügbar';

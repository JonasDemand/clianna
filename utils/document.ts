import {
  IDocument,
  IDocumentWithDependencies,
} from '@customTypes/database/document';

export const getDocumentLabel = (
  document: IDocument | IDocumentWithDependencies | null | undefined
) =>
  document ? `${document.id}${document.name ? ` - ${document.name}` : ''}` : '';

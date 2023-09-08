import { IDocumentWithDependencies } from '@customTypes/database/document';

export interface ICreateRootfolderResponse {
  cliannaFolderId: string;
}

export interface IUpsertRequest extends Omit<IDocumentWithDependencies, 'id'> {}

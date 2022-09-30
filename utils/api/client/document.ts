import {
  IDocument,
  IDocumentWithDependencies,
} from '@customTypes/database/document';
import {
  ICreateRootfolderResponse,
  IUpsertRequest,
} from '@customTypes/messages/document';

import { createClientFunction } from './helpers';

export class Document {
  public static Create = createClientFunction<
    IUpsertRequest,
    IDocument,
    string
  >('/api/document', 'POST');

  public static Update = (id: string, request: IUpsertRequest) =>
    createClientFunction<IUpsertRequest, IDocumentWithDependencies, string>(
      `/api/document/${id}`,
      'PUT'
    )(request);

  public static Delete = (id: string) =>
    createClientFunction<void, void, string>(`/api/document/${id}`, 'DELETE')();

  public static CreateRootFolder = createClientFunction<
    void,
    ICreateRootfolderResponse,
    string
  >('/api/document/rootfolder', 'POST');
}

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

  public static Update = (
    id: string,
    request: IUpsertRequest,
    baseUrl?: string
  ) =>
    createClientFunction<IUpsertRequest, IDocumentWithDependencies, string>(
      `/api/document/${id}`,
      'PUT'
    )(request, baseUrl);
  public static Copy = (
    id: string,
    request: IUpsertRequest,
    baseUrl?: string
  ) =>
    createClientFunction<IUpsertRequest, IDocumentWithDependencies, string>(
      `/api/document/${id}/copy`,
      'POST'
    )(request, baseUrl);

  public static Delete = (id: string, baseUrl?: string) =>
    createClientFunction<void, void, string>(`/api/document/${id}`, 'DELETE')(
      undefined,
      baseUrl
    );

  public static CreateRootFolder = createClientFunction<
    void,
    ICreateRootfolderResponse,
    string
  >('/api/document/rootfolder', 'POST');
}

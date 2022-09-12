import { ICreateRootfolderResponse } from '@customTypes/messages/document';

import { createClientFunction } from './helpers';

export class Document {
  public static CreateRootFolder = createClientFunction<
    void,
    ICreateRootfolderResponse,
    string
  >('/api/document/rootfolder', 'POST');
}

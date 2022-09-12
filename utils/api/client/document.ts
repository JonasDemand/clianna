import { ICreateRootfolderResponse } from '@customTypes/messages/document';

export class Document {
  public static async CreateRootFolder(): Promise<ICreateRootfolderResponse> {
    const res = await fetch(`/api/document/rootfolder`, {
      method: 'POST',
    });
    if (!res.ok) {
      throw 'Failed to delete customer';
    }
    return (await res.json()) as ICreateRootfolderResponse;
  }
}

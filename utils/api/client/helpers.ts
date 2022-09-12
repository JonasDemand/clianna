import { IResponse } from '@customTypes/api';

export const createClientFunction =
  <REQ = void, RES = void, ERR = void>(url: string, method: string) =>
  async (request?: REQ): Promise<IResponse<RES, ERR>> => {
    const res = await fetch(url, {
      method: method,
      body: request && JSON.stringify(request),
      headers: request && { 'content-type': 'application/json' },
    });
    const isJsonResponse =
      res.headers.get('content-type') === 'application/json';
    return {
      response: isJsonResponse ? ((await res.json()) as RES) : undefined,
      error: !res.ok
        ? {
            status: res.status,
            statusText: res.statusText,
            body: isJsonResponse
              ? ((await res.json()) as ERR)
              : await res.text(),
          }
        : undefined,
    };
  };

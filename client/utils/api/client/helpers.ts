import { IResponse } from '@customTypes/api';

export const createClientFunction =
  <REQ = void, RES = void, ERR = void>(url: string, method: string) =>
  async (request?: REQ, host?: string): Promise<IResponse<RES, ERR>> => {
    const res = await fetch(host ? host + url : url, {
      method: method,
      body: request && JSON.stringify(request),
      headers: request && { 'content-type': 'application/json' },
    });
    let body: object | undefined;
    try {
      body = await res.json();
    } catch {}
    return {
      response: body ? (body as RES) : undefined,
      error: !res.ok
        ? {
            status: res.status,
            statusText: res.statusText,
            body: body ? (body as ERR) : undefined,
          }
        : undefined,
    };
  };

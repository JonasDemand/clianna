export interface IResponse<RES, ERR> {
  response?: RES;
  error?: {
    status: number;
    statusText: string;
    body?: ERR;
  };
}

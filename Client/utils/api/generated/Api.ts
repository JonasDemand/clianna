/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AuthenticateRequest {
  username?: string | null;
  password?: string | null;
}

export interface Customer {
  id?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  street?: string | null;
  streetNumber?: string | null;
  city?: string | null;
  postalCode?: string | null;
  phone?: string | null;
  mobile?: string | null;
  whatsApp?: boolean | null;
  /** @format float */
  shoeSize?: number | null;
  disabled?: boolean | null;
  comment?: string | null;
  salutation?: ECustomerSalutation;
  orders?: Order[] | null;
  documents?: Document[] | null;
}

export interface CustomerListResponse {
  data?: Customer[] | null;
  error?: Error;
}

export interface CustomerResponse {
  data?: Customer;
  error?: Error;
}

export interface Document {
  id?: string | null;
  googleId?: string | null;
  name?: string | null;
  /** @format date-time */
  creationDate?: Date;
  template?: boolean;
  /** @format int32 */
  incrementalId?: number | null;
  orderId?: string | null;
  customerId?: string | null;
  order?: Order;
  customer?: Customer;
}

export interface DocumentListResponse {
  data?: Document[] | null;
  error?: Error;
}

export interface DocumentResponse {
  data?: Document;
  error?: Error;
}

export enum ECustomerSalutation {
  Mr = "Mr",
  Mrs = "Mrs",
  Diverse = "Diverse",
  Company = "Company",
}

export enum EOrderShippingType {
  Send = "Send",
  Collect = "Collect",
  Visit = "Visit",
}

export enum EOrderTax {
  Nineteen = "Nineteen",
  Seven = "Seven",
}

export enum EOrderType {
  Einlagen = "Einlagen",
  Einlagenarbeiten = "Einlagenarbeiten",
  Abrolloptimierung = "Abrolloptimierung",
  Schuharbeiten = "Schuharbeiten",
  Massschuhleisten = "Massschuhleisten",
  Massschuhe = "Massschuhe",
  Schuhbestellung = "Schuhbestellung",
  Miscellaneous = "Miscellaneous",
}

export interface Error {
  statuscode?: HttpStatusCode;
  message?: string | null;
}

export enum HttpStatusCode {
  Continue = "Continue",
  SwitchingProtocols = "SwitchingProtocols",
  Processing = "Processing",
  EarlyHints = "EarlyHints",
  OK = "OK",
  Created = "Created",
  Accepted = "Accepted",
  NonAuthoritativeInformation = "NonAuthoritativeInformation",
  NoContent = "NoContent",
  ResetContent = "ResetContent",
  PartialContent = "PartialContent",
  MultiStatus = "MultiStatus",
  AlreadyReported = "AlreadyReported",
  IMUsed = "IMUsed",
  MultipleChoices = "MultipleChoices",
  MovedPermanently = "MovedPermanently",
  Found = "Found",
  SeeOther = "SeeOther",
  NotModified = "NotModified",
  UseProxy = "UseProxy",
  Unused = "Unused",
  TemporaryRedirect = "TemporaryRedirect",
  PermanentRedirect = "PermanentRedirect",
  BadRequest = "BadRequest",
  Unauthorized = "Unauthorized",
  PaymentRequired = "PaymentRequired",
  Forbidden = "Forbidden",
  NotFound = "NotFound",
  MethodNotAllowed = "MethodNotAllowed",
  NotAcceptable = "NotAcceptable",
  ProxyAuthenticationRequired = "ProxyAuthenticationRequired",
  RequestTimeout = "RequestTimeout",
  Conflict = "Conflict",
  Gone = "Gone",
  LengthRequired = "LengthRequired",
  PreconditionFailed = "PreconditionFailed",
  RequestEntityTooLarge = "RequestEntityTooLarge",
  RequestUriTooLong = "RequestUriTooLong",
  UnsupportedMediaType = "UnsupportedMediaType",
  RequestedRangeNotSatisfiable = "RequestedRangeNotSatisfiable",
  ExpectationFailed = "ExpectationFailed",
  MisdirectedRequest = "MisdirectedRequest",
  UnprocessableEntity = "UnprocessableEntity",
  Locked = "Locked",
  FailedDependency = "FailedDependency",
  UpgradeRequired = "UpgradeRequired",
  PreconditionRequired = "PreconditionRequired",
  TooManyRequests = "TooManyRequests",
  RequestHeaderFieldsTooLarge = "RequestHeaderFieldsTooLarge",
  UnavailableForLegalReasons = "UnavailableForLegalReasons",
  InternalServerError = "InternalServerError",
  NotImplemented = "NotImplemented",
  BadGateway = "BadGateway",
  ServiceUnavailable = "ServiceUnavailable",
  GatewayTimeout = "GatewayTimeout",
  HttpVersionNotSupported = "HttpVersionNotSupported",
  VariantAlsoNegotiates = "VariantAlsoNegotiates",
  InsufficientStorage = "InsufficientStorage",
  LoopDetected = "LoopDetected",
  NotExtended = "NotExtended",
  NetworkAuthenticationRequired = "NetworkAuthenticationRequired",
}

export interface Order {
  id?: string | null;
  /** @format date-time */
  creationDate?: Date;
  pending?: boolean;
  shippingType?: EOrderShippingType;
  comment?: string | null;
  /** @format float */
  price?: number | null;
  taxes?: EOrderTax;
  /** @format date-time */
  dueDate?: Date | null;
  type?: EOrderType;
  brand?: string | null;
  article?: string | null;
  color?: string | null;
  dealer?: string | null;
  /** @format float */
  size?: number | null;
  name?: string | null;
  customerId?: string | null;
  documents?: Document[] | null;
  customer?: Customer;
}

export interface OrderListResponse {
  data?: Order[] | null;
  error?: Error;
}

export interface OrderResponse {
  data?: Order;
  error?: Error;
}

export interface UserSession {
  token?: string | null;
  id?: string | null;
  email?: string | null;
}

export interface UserSessionResponse {
  data?: UserSession;
  error?: Error;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              r.data = data;
              if (!r.ok) {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      return data.data;
    });
  };
}

/**
 * @title Clianna API
 * @version v1
 */
export class Client<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  customer = {
    /**
     * No description
     *
     * @tags Customer
     * @name CustomerList
     * @request GET:/Customer
     * @secure
     */
    customerList: (params: RequestParams = {}) =>
      this.request<CustomerListResponse, any>({
        path: `/Customer`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customer
     * @name CustomerCreate
     * @request POST:/Customer
     * @secure
     */
    customerCreate: (data: Customer, params: RequestParams = {}) =>
      this.request<CustomerResponse, any>({
        path: `/Customer`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customer
     * @name CustomerDetail
     * @request GET:/Customer/{id}
     * @secure
     */
    customerDetail: (id: string, params: RequestParams = {}) =>
      this.request<CustomerResponse, any>({
        path: `/Customer/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customer
     * @name CustomerUpdate
     * @request PUT:/Customer/{id}
     * @secure
     */
    customerUpdate: (id: string, data: Customer, params: RequestParams = {}) =>
      this.request<CustomerResponse, any>({
        path: `/Customer/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customer
     * @name CustomerDelete
     * @request DELETE:/Customer/{id}
     * @secure
     */
    customerDelete: (id: string, params: RequestParams = {}) =>
      this.request<CustomerResponse, any>({
        path: `/Customer/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  document = {
    /**
     * No description
     *
     * @tags Document
     * @name DocumentList
     * @request GET:/Document
     * @secure
     */
    documentList: (params: RequestParams = {}) =>
      this.request<DocumentListResponse, any>({
        path: `/Document`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Document
     * @name DocumentCreate
     * @request POST:/Document
     * @secure
     */
    documentCreate: (data: Document, params: RequestParams = {}) =>
      this.request<DocumentResponse, any>({
        path: `/Document`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Document
     * @name DocumentDetail
     * @request GET:/Document/{id}
     * @secure
     */
    documentDetail: (id: string, params: RequestParams = {}) =>
      this.request<DocumentResponse, any>({
        path: `/Document/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Document
     * @name DocumentUpdate
     * @request PUT:/Document/{id}
     * @secure
     */
    documentUpdate: (id: string, data: Document, params: RequestParams = {}) =>
      this.request<DocumentResponse, any>({
        path: `/Document/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Document
     * @name DocumentDelete
     * @request DELETE:/Document/{id}
     * @secure
     */
    documentDelete: (id: string, params: RequestParams = {}) =>
      this.request<DocumentResponse, any>({
        path: `/Document/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  order = {
    /**
     * No description
     *
     * @tags Order
     * @name OrderList
     * @request GET:/Order
     * @secure
     */
    orderList: (params: RequestParams = {}) =>
      this.request<OrderListResponse, any>({
        path: `/Order`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrderCreate
     * @request POST:/Order
     * @secure
     */
    orderCreate: (data: Order, params: RequestParams = {}) =>
      this.request<OrderResponse, any>({
        path: `/Order`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrderDetail
     * @request GET:/Order/{id}
     * @secure
     */
    orderDetail: (id: string, params: RequestParams = {}) =>
      this.request<OrderResponse, any>({
        path: `/Order/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrderUpdate
     * @request PUT:/Order/{id}
     * @secure
     */
    orderUpdate: (id: string, data: Order, params: RequestParams = {}) =>
      this.request<OrderResponse, any>({
        path: `/Order/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrderDelete
     * @request DELETE:/Order/{id}
     * @secure
     */
    orderDelete: (id: string, params: RequestParams = {}) =>
      this.request<OrderResponse, any>({
        path: `/Order/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  user = {
    /**
     * No description
     *
     * @tags User
     * @name AuthenticateCreate
     * @request POST:/User/Authenticate
     * @secure
     */
    authenticateCreate: (data: AuthenticateRequest, params: RequestParams = {}) =>
      this.request<UserSessionResponse, any>({
        path: `/User/Authenticate`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name ProfileUpdate
     * @request PUT:/User/Profile
     * @secure
     */
    profileUpdate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/User/Profile`,
        method: "PUT",
        secure: true,
        ...params,
      }),
  };
}

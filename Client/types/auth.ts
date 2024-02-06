export enum ESessionCookieName {
  JwtToken = 'SessionJwt',
  ValidJwt = 'SessionValidJwt',
  RefreshToken = 'SessionRefreshToken',
}

export interface SessionCookies {
  [ESessionCookieName.JwtToken]: string;
  [ESessionCookieName.ValidJwt]: boolean;
  [ESessionCookieName.RefreshToken]: string;
}

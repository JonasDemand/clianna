import {
  SESSION_JWT_COOKIE_NAME,
  SESSION_JWT_VALID_COOKIE_NAME,
  SESSION_REFRESHTOKEN_COOKIE_NAME,
} from '@consts/auth';
import { getApiClient } from '@utils/api/ApiClient';
import {
  RequestCookies,
  ResponseCookies,
} from 'next/dist/compiled/@edge-runtime/cookies';
import { NextRequest, NextResponse } from 'next/server';

//https://github.com/vercel/next.js/issues/49442#issuecomment-1679807704
const applySetCookie = (req: NextRequest, res: NextResponse) => {
  // parse the outgoing Set-Cookie header
  const setCookies = new ResponseCookies(res.headers);
  // Build a new Cookie header for the request by adding the setCookies
  const newReqHeaders = new Headers(req.headers);
  const newReqCookies = new RequestCookies(newReqHeaders);
  setCookies.getAll().forEach((cookie) => newReqCookies.set(cookie));
  // set “request header overrides” on the outgoing response
  NextResponse.next({
    request: { headers: newReqHeaders },
  }).headers.forEach((value, key) => {
    if (
      key === 'x-middleware-override-headers' ||
      key.startsWith('x-middleware-request-')
    ) {
      res.headers.set(key, value);
    }
  });
};

const loginRedirect = (url: string) =>
  NextResponse.redirect(new URL(`/login?redirectUrl=${url}`, url));

export const middleware = async (req: NextRequest) => {
  const response = NextResponse.next();
  if (req.cookies.has(SESSION_JWT_VALID_COOKIE_NAME)) return response;
  if (
    !req.cookies.has(SESSION_JWT_COOKIE_NAME) ||
    !req.cookies.has(SESSION_REFRESHTOKEN_COOKIE_NAME)
  )
    return loginRedirect(req.url);
  const client = getApiClient();
  client.setSecurityData({
    accessToken: req.cookies.get(SESSION_JWT_COOKIE_NAME)?.value,
  });
  const { data, error } = await client.user.refreshUpdate({
    refreshToken: req.cookies.get(SESSION_REFRESHTOKEN_COOKIE_NAME)?.value,
  });
  console.log(data, error);

  if (
    error ||
    !data ||
    !data.accessToken ||
    !data.refreshToken ||
    !data.accessTokenExpireDate ||
    !data.refreshTokenExpireDate
  )
    return loginRedirect(req.url); //Go to login if refreshing fails

  const refreshTokenExpireDate = new Date(data.refreshTokenExpireDate); //Somehow JS Date needs to be re-created
  response.cookies.set(SESSION_JWT_COOKIE_NAME, data.accessToken, {
    expires: refreshTokenExpireDate, // jwt needs to be held for longer to "authenticate" to refresh api
  });
  response.cookies.set(SESSION_JWT_VALID_COOKIE_NAME, 'true', {
    expires: refreshTokenExpireDate,
  });
  response.cookies.set(SESSION_REFRESHTOKEN_COOKIE_NAME, data.refreshToken, {
    expires: new Date(data.refreshTokenExpireDate),
  });
  applySetCookie(req, response);
  return response;
};
export const config = {
  matcher: '/manage/:path*',
};

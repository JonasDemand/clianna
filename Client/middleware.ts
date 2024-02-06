import { ESessionCookieName } from '@customTypes/auth';
import { getApiClient } from '@utils/api/ApiClient';
import { generateCookiesFromTokens } from '@utils/auth';
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
  NextResponse.redirect(new URL(`/login?redirectUrl=${encodeURI(url)}`, url));

export const middleware = async (req: NextRequest) => {
  const response = NextResponse.next();
  if (req.cookies.has(ESessionCookieName.ValidJwt)) return response;
  if (
    !req.cookies.has(ESessionCookieName.JwtToken) ||
    !req.cookies.has(ESessionCookieName.RefreshToken)
  )
    return loginRedirect(req.url);
  const client = getApiClient();
  client.setSecurityData({
    [ESessionCookieName.JwtToken]: req.cookies.get(ESessionCookieName.JwtToken)
      ?.value,
  });
  const { data, error } = await client.user.refreshUpdate(
    {
      refreshToken: req.cookies.get(ESessionCookieName.RefreshToken)?.value,
    },
    { dontCheckJwt: true }
  );

  if (error || !data) return loginRedirect(req.url); //Go to login if refreshing fails

  const cookies = generateCookiesFromTokens(data);
  if (!cookies) return loginRedirect(req.url);

  cookies.forEach(({ name, value, ...options }) =>
    response.cookies.set(name, value, { ...options })
  );
  applySetCookie(req, response);
  return response;
};
export const config = {
  matcher: '/manage/:path*',
};

export const getScope = (additionalScopes?: string) =>
  `https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email ${
    additionalScopes ?? ''
  }`;

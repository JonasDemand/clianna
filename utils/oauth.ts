import { EGoogleScope } from '@customTypes/oauth';

export const getScope = (additionalScopes: EGoogleScope[] = []) =>
  [EGoogleScope.userinfo_profile, EGoogleScope.userinfo_email]
    .concat(additionalScopes)
    .join(' ');

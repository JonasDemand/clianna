import { EGoogleScope } from '@consts/oauth';

export const getScope = (additionalScopes: EGoogleScope[] = []) =>
  [EGoogleScope.userinfo_profile, EGoogleScope.userinfo_email]
    .concat(additionalScopes)
    .join(' ');

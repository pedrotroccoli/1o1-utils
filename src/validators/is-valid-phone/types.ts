interface IsValidPhoneParams {
  phone: unknown;
}

type IsValidPhoneResult = boolean;

type IsValidPhoneFn = (params: IsValidPhoneParams) => IsValidPhoneResult;

export type { IsValidPhoneFn, IsValidPhoneParams, IsValidPhoneResult };

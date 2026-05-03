type CountryCode =
  | "AE"
  | "AR"
  | "AT"
  | "AU"
  | "BE"
  | "BR"
  | "CA"
  | "CH"
  | "CL"
  | "CN"
  | "CO"
  | "DE"
  | "DK"
  | "EC"
  | "EG"
  | "ES"
  | "FI"
  | "FR"
  | "GB"
  | "HK"
  | "ID"
  | "IE"
  | "IL"
  | "IN"
  | "IT"
  | "JP"
  | "KE"
  | "KR"
  | "MX"
  | "MY"
  | "NG"
  | "NL"
  | "NO"
  | "NZ"
  | "PE"
  | "PH"
  | "PL"
  | "PT"
  | "RU"
  | "SA"
  | "SE"
  | "SG"
  | "TH"
  | "TR"
  | "US"
  | "UY"
  | "VE"
  | "VN"
  | "ZA";

interface IsValidPhoneParams {
  phone: unknown;
  country?: CountryCode;
}

type IsValidPhoneResult = boolean;

type IsValidPhoneFn = (params: IsValidPhoneParams) => IsValidPhoneResult;

export type {
  CountryCode,
  IsValidPhoneFn,
  IsValidPhoneParams,
  IsValidPhoneResult,
};
